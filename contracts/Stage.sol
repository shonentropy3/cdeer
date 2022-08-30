import "./interface/IOrder.sol";
import "./libs/ECDSA.sol";

contract Stage {
    error InvalidCaller();

    uint8 private maxStages = 12;
    address private orderAddr;

    enum StageStatus {
        Init,
        Delivered,
        Accepted,
        Aborted,
        Done       // withdrawed
    }

    //交付阶段
    struct Stage {
        uint amount;        // pay amount
        uint period;        // second
        StageStatus status;
    }

    // orderId = >
    mapping(uint => Stage[]) private orderStages;

    event SetStage(uint indexed orderId, uint[] amounts, uint[] periods);

    bytes32 public DOMAIN_SEPARATOR;
    bytes32 public constant PERMITSTAGE_TYPEHASH = keccak256("PermitStage(uint256 orderId,uint256[] amounts,uint256[] periods,uint256 deadline)");


    constructor(address _order) {
        orderAddr = _order; 

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                // This should match the domain you set in your client side signing.
                keccak256(bytes("DetaskStage")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    modifier onlyOrderCall() {
        if(msg.sender == orderAddr) revert InvalidCaller(); 
        _;
    }

    function setStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods) external onlyOrderCall {
        require(_amounts.length == _periods.length && _amounts.length != 0, "Wrong parameter length.");
        require(maxStages >= _amounts.length, "Wrong parameter length.");

        delete orderStages[_orderId];
        Stage[] storage stages = orderStages[_orderId];

        for ( uint i = 0; i < _periods.length; i++ ) {
            Stage memory pro = Stage ({
                amount: _amounts[i],
                period: _periods[i],
                status: StageStatus.Init
            });
            stages.push(pro);
        }


        emit SetStage(_orderId, _amounts, _periods);
        
    }


    function appendStage(uint _orderId, uint amount, uint period, string calldata milestone, bytes calldata  _signature) external {
        

    }

    function prolongStage(uint _orderId, uint _stageIndex, uint newPeriod, bytes calldata _signature) external {
        
    }



    function totalAmount(uint orderId) external view returns(uint total)  {
        Stage[] storage stages = orderStages[orderId];
        for ( uint i = 0; i < stages.length; i++ ) {
            total += stages[i].amount;
        }
    }

    function permitStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods,
        uint deadline,
        uint8 v,
        bytes32 r,
        bytes32 s) public {
        

        bytes32 structHash = keccak256(abi.encode(PERMITSTAGE_TYPEHASH, _orderId,
            keccak256(abi.encodePacked(_amounts)), keccak256(abi.encodePacked(_periods)), deadline));
        bytes32 digest = ECDSA.toTypedDataHash(DOMAIN_SEPARATOR, structHash);

        address recoveredAddress = ECDSA.recover(digest, v, r, s);
        
        Order storage order = orders[_orderId];
        require(order.worker == recoveredAddress, "Invalid Worker Signature");
        
        Stage[] storage stages = orderStages[_orderId];
        require(stages.length == _periods.length && _periods.length == _amounts.length, "mismatch");
        
        for ( uint i = 0; i < stages.length; i++) {
            require(_amounts[i] == stages[i].amount, "mismatch amount");
            require(_periods[i] == stages[i].period, "mismatch period");
        }

        order.progress = OrderProgess.Staged;
    }

    function startOrder(uint _orderId) external onlyOrderCall {
        Stage[] storage stages = orderStages[_orderId];
        if (stages[0].period == 0) {
            stages[0].status = StageStatus.Accepted;
        }
    }

    function abortOrder(uint _orderId, address who) external onlyOrderCall returns(uint currStageIndex, uint issuerAmount, uint workerAmount) {
        ( currStageIndex, uint stageStartDate) = currStage(_orderId);

        Stage[] storage stages = orderStages[_orderId];

        for (uint i = 0; i < currStageIndex; i++) {
            if(stages[i].status != StageStatus.Done) {
                workerAmount += stages[i].amount;
                stages[i].status == StageStatus.Done;
            }
        }

        Stage storage stage = stages[currStageIndex];
        if (order.worker == who) {
            issuerAmount += stage.amount;
        } else {
            workerAmount += stage.amount * (block.timestamp - stageStartDate) / stage.period;
            issuerAmount += stage.amount * (stageStartDate + stage.period - block.timestamp) / stage.period;
        }
        stage.status = StageStatus.Aborted;

        for (uint i = currStageIndex + 1; i < stages.length; i++) {
            issuerAmount += stages[i].amount;
            stages[i].status == StageStatus.Aborted;
        }
    }

        // confirm must continuous
    function confirmStage(uint _orderId, uint _stageIndex) external {
        uint taskId = orders[_orderId].taskId;
        if(msg.sender != ITask(task).ownerOf(taskId)) revert PermissionsError(); 
        require(orderStages[_orderId][_stageIndex].status != StageStatus.Done, "Done");

        if (_stageIndex == 0) {
            orderStages[_orderId][_stageIndex].status = StageStatus.Accepted;
        } else {
            require(orderStages[_orderId][_stageIndex-1].status == StageStatus.Accepted, "The previous stage was not accepted");
            orderStages[_orderId][_stageIndex].status = StageStatus.Accepted;
        }
        
        emit ConfirmOrderStage(_orderId, _stageIndex);
    }

    function getOrderStages(uint _orderId) external view returns(Stage[] memory stages) {
        return orderStages[_orderId];
    }

    function currStage(uint _orderId) public view returns (uint stageIndex, uint stageStartDate) {
        Order memory order = IOrder(orderAddr).orders(_orderId);
        stageStartDate = order.startDate;
        require(order.progress == OrderProgess.Started, "UnOngoing");

        Stage[] storage stages = orderStages[_orderId];
        uint nowTs = block.timestamp;
        uint i = 0;
        for (; i < stages.length; i++) {
            Stage storage stage = stages[i];
            if(stage.status != StageStatus.Accepted && nowTs < stageStartDate + stage.period) {
                stageIndex = i;
                return (stageIndex, stageStartDate);
            }
            stageStartDate += stage.period;
        }
        revert("Order Ended");
    }

}