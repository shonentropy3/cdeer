import "./interface/IOrder.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

//TODO: as upgradeable
contract DeStage is Ownable {
    error InvalidCaller();

    uint public maxStages = 12;
    address private orderAddr;

    enum StageStatus {
        Init,
        Accepted,
        Aborted,
        Withdrawed
    }

    //交付阶段
    struct Stage {
        uint amount;        // pay amount
        uint period;        // second
        StageStatus status;
    }

    // orderId = >
    mapping(uint => Stage[]) private orderStages;

    event ConfirmOrderStage(uint indexed orderId, uint stageIndex);
    event SetStage(uint indexed orderId, uint[] amounts, uint[] periods);

    constructor(address _order) {
        orderAddr = _order; 
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

    function prolongStage(uint _orderId, uint _stageIndex, uint newPeriod) external onlyOrderCall {
        Stage storage stage = orderStages[_orderId][_stageIndex];
        require(stage.status == StageStatus.Init, "invalid status");
        stage.period += newPeriod;
    }

    function totalAmount(uint orderId) external view returns(uint total)  {
        Stage[] storage stages = orderStages[orderId];
        for ( uint i = 0; i < stages.length; i++ ) {
            total += stages[i].amount;
        }
    }

    function checkStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods) external view returns (bool) {
        Stage[] memory stages = orderStages[_orderId];
        require(stages.length == _periods.length && _periods.length == _amounts.length, "mismatch");
        
        for(uint i = 0; i < stages.length; i++) {
            require(_amounts[i] == stages[i].amount, "mismatch amount");
            require(_periods[i] == stages[i].period, "mismatch period");
        }
        return true;
    }

    function startOrder(uint _orderId) external onlyOrderCall {
        Stage[] storage stages = orderStages[_orderId];
        if (stages[0].period == 0) {
            stages[0].status = StageStatus.Accepted;
        }
    }

    function pendingWithdraw(uint _orderId) external view returns (uint pending, uint nextStage) {
        Order memory order = IOrder(orderAddr).getOrder(_orderId);
        uint lastStageEnd = order.startDate;

        Stage[] memory stages = orderStages[_orderId];
        uint nowTs = block.timestamp;
        for ( uint i = 0; i < stages.length; i++) {
            Stage memory stage = stages[i];
            if(stage.status == StageStatus.Accepted || nowTs >= lastStageEnd + stage.period) {
                pending += stage.amount;
                nextStage = i+1;
            }
            lastStageEnd += stage.period;
        }

    }

    function withdrawStage(uint _orderId, uint _nextStage) external onlyOrderCall {
        Stage[] storage stages = orderStages[_orderId];

        for ( uint i = 0; i < stages.length && i < _nextStage; i++) {
            if (stages[i].status != StageStatus.Withdrawed) {
                stages[i].status = StageStatus.Withdrawed;
            }
        }
    }

    function abortOrder(uint _orderId, bool issuerAbort) external onlyOrderCall returns(uint currStageIndex, uint issuerAmount, uint workerAmount) {
        uint stageStartDate;
        ( currStageIndex, stageStartDate) = ongoingStage(_orderId);

        Stage[] storage stages = orderStages[_orderId];

        for (uint i = 0; i < currStageIndex; i++) {
            if(stages[i].status != StageStatus.Withdrawed) {
                workerAmount += stages[i].amount;
                stages[i].status == StageStatus.Withdrawed;
            }
        }

        Stage storage stage = stages[currStageIndex];
        if (issuerAbort) {
            workerAmount += stage.amount * (block.timestamp - stageStartDate) / stage.period;
            issuerAmount += stage.amount * (stageStartDate + stage.period - block.timestamp) / stage.period;
        } else {
            issuerAmount += stage.amount;
        }
        stage.status = StageStatus.Aborted;

        for (uint i = currStageIndex + 1; i < stages.length; i++) {
            issuerAmount += stages[i].amount;
            stages[i].status == StageStatus.Aborted;
        }
    }

        // confirm must continuous
    function confirmStage(uint _orderId, uint _stageIndex) external onlyOrderCall {
        require(orderStages[_orderId][_stageIndex].status != StageStatus.Withdrawed, "Done");

        if (_stageIndex == 0) {
            orderStages[_orderId][_stageIndex].status = StageStatus.Accepted;
        } else {
            require(orderStages[_orderId][_stageIndex-1].status == StageStatus.Accepted, "The previous stage was not accepted");
            orderStages[_orderId][_stageIndex].status = StageStatus.Accepted;
        }
        
        emit ConfirmOrderStage(_orderId, _stageIndex);
    }

    function stagesLength(uint orderId) external view returns(uint len)  {
        len = orderStages[orderId].length; 
    }

    function getStages(uint _orderId) external view returns(Stage[] memory stages) {
        stages = orderStages[_orderId];
    }

    function ongoingStage(uint _orderId) public view returns (uint stageIndex, uint stageStartDate) {
        Order memory order = IOrder(orderAddr).getOrder(_orderId);
        stageStartDate = order.startDate;
        require(order.progress == OrderProgess.Ongoing, "UnOngoing");

        Stage[] storage stages = orderStages[_orderId];
        uint nowTs = block.timestamp;
        uint i = 0;
        for (; i < stages.length; i++) {
            Stage storage stage = stages[i];
            if(stage.status == StageStatus.Init && nowTs < stageStartDate + stage.period) {
                stageIndex = i;
                return (stageIndex, stageStartDate);
            }
            stageStartDate += stage.period;
        }
        
        revert("Order Ended");
    }

    function modifyMaxStages(uint8 _maxStages) external onlyOwner {
        maxStages = _maxStages;
    }

}