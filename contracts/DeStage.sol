import "./interface/IOrder.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

//TODO: as upgradeable
contract DeStage is Ownable {
    error InvalidCaller();
    error ParamError(uint);
    error StatusError();
    error AmountError();

    uint public maxStages = 12;
    address public deOrder;

    enum StageStatus {
        Init,
        Accepted,
        Aborted,
        Withdrawed
    }

    //交付阶段
    struct Stage {
        uint96 amount;        // pay amount
        uint32 period;        // second
        StageStatus status;
    }

    // orderId = >
    mapping(uint => Stage[]) private orderStages;

    event ConfirmOrderStage(uint indexed orderId, uint stageIndex);
    event SetStage(uint indexed orderId, uint[] amounts, uint[] periods);
    event ProlongStage(uint indexed orderId, uint stageIndex, uint appendPeriod);
    event AppendStage(uint indexed orderId, uint amount, uint period);
    event SetDeorder(address deorder);
    event SetMaxStages(uint max);

    constructor(address _order) {
        deOrder = _order; 
        emit SetDeorder(_order);
    }

    modifier onlyDeorder() {
        if(msg.sender != deOrder) revert InvalidCaller(); 
        _;
    }


    function setStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods) external onlyDeorder {

        if(_amounts.length != _periods.length || _amounts.length == 0) revert ParamError(0);
        if(maxStages < _amounts.length) revert ParamError(1);

        delete orderStages[_orderId];
        Stage[] storage stages = orderStages[_orderId];

        for ( uint i = 0; i < _periods.length; i++ ) {
            safe96(_amounts[i]);
            safe32(_periods[i]);

            Stage memory pro = Stage ({
                amount: uint96(_amounts[i]),
                period: uint32(_periods[i]),
                status: StageStatus.Init
            });
            stages.push(pro);
        }
        emit SetStage(_orderId, _amounts, _periods);
    }

    function prolongStage(uint _orderId, uint _stageIndex, uint _appendPeriod) external onlyDeorder {
        safe32(_appendPeriod);

        Stage storage stage = orderStages[_orderId][_stageIndex];
        if(stage.status != StageStatus.Init) revert StatusError();
        stage.period += uint32(_appendPeriod);

        emit ProlongStage(_orderId, _stageIndex, _appendPeriod);
    }

    function appendStage(uint _orderId, uint _amount, uint _period) external onlyDeorder {
        safe32(_period);

        Stage[] storage stages = orderStages[_orderId];
        Stage memory pro = Stage ({
            amount: uint96(_amount),
            period: uint32(_period),
            status: StageStatus.Init
        });

        stages.push(pro);
        emit AppendStage(_orderId, _amount, _period);
    }

    function totalStagePeriod(uint orderId) external view returns(uint total) {
        Stage[] storage stages = orderStages[orderId];
        for ( uint i = 0; i < stages.length; i++ ) {
            total += stages[i].period;
        }
    }

    function totalAmount(uint orderId) external view returns(uint total)  {
        Stage[] storage stages = orderStages[orderId];
        for ( uint i = 0; i < stages.length; i++ ) {
            total += stages[i].amount;
        }
    }

    function startOrder(uint _orderId) external onlyDeorder {
        Stage[] storage stages = orderStages[_orderId];
        if (stages[0].period == 0) {
            stages[0].status = StageStatus.Accepted;
        }
    }

    function pendingWithdraw(uint _orderId) external view returns (uint pending, uint nextStage) {
        Order memory order = IOrder(deOrder).getOrder(_orderId);
        if(order.progress != OrderProgess.Ongoing) revert StatusError();
        uint lastStageEnd = order.startDate;
        bool payByDue = order.payType == PaymentType.Due;

        Stage[] memory stages = orderStages[_orderId];
        uint nowTs = block.timestamp;
        for ( uint i = 0; i < stages.length; i++) {
            Stage memory stage = stages[i];
            if( (stage.status == StageStatus.Accepted) || 
                (payByDue && stage.status == StageStatus.Init &&  nowTs >= lastStageEnd + stage.period)) {
                pending += stage.amount;
                nextStage = i+1;
            }
            lastStageEnd += stage.period;
        }

    }

    function withdrawStage(uint _orderId, uint _nextStage) external onlyDeorder {
        Stage[] storage stages = orderStages[_orderId];

        for ( uint i = 0; i < stages.length && i < _nextStage; i++) {
            if (stages[i].status != StageStatus.Withdrawed) {
                stages[i].status = StageStatus.Withdrawed;
            }
        }
    }

    function abortOrder(uint _orderId, bool issuerAbort) external onlyDeorder returns(uint currStageIndex, uint issuerAmount, uint workerAmount) {
        uint stageStartDate;
        ( currStageIndex, stageStartDate) = ongoingStage(_orderId);
        
        Order memory order = IOrder(deOrder).getOrder(_orderId);
        bool payByDue = order.payType == PaymentType.Due;
        Stage[] storage stages = orderStages[_orderId];

        for (uint i = 0; i < currStageIndex; i++) {
            if(stages[i].status != StageStatus.Withdrawed) {
                // passed or accepted , pay to worker.
                if (stages[i].status == StageStatus.Accepted || payByDue) {
                    workerAmount += stages[i].amount;
                    stages[i].status == StageStatus.Withdrawed;
                } else {
                    issuerAmount += stages[i].amount;
                }
            }
        }

        Stage storage stage = stages[currStageIndex];

        if (issuerAbort && payByDue) {
            workerAmount += stage.amount * (block.timestamp - stageStartDate) / stage.period;
            issuerAmount += stage.amount * (stageStartDate + stage.period - block.timestamp) / stage.period;
        } else {
            issuerAmount += stage.amount;
        }
        stage.status = StageStatus.Aborted;

        for (uint i = currStageIndex + 1; i < stages.length;) {
            issuerAmount += stages[i].amount;
            stages[i].status == StageStatus.Aborted;
            unchecked {
                i++;
            }
        }
    }

        // confirm must continuous
    function confirmDelivery(uint _orderId, uint _stageIndex) external onlyDeorder {
        StageStatus currStatus = orderStages[_orderId][_stageIndex].status;
        if( currStatus == StageStatus.Withdrawed || currStatus == StageStatus.Aborted ) revert StatusError();

        if (_stageIndex == 0) {
            orderStages[_orderId][_stageIndex].status = StageStatus.Accepted;
        } else {
            StageStatus lastStatus = orderStages[_orderId][_stageIndex-1].status;
            if(lastStatus == StageStatus.Accepted || lastStatus == StageStatus.Withdrawed) {
                orderStages[_orderId][_stageIndex].status = StageStatus.Accepted;
            } else {
                revert StatusError();
            }
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
        Order memory order = IOrder(deOrder).getOrder(_orderId);
        stageStartDate = order.startDate;
        if(order.progress != OrderProgess.Ongoing) revert StatusError();

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
        
        revert StatusError();
    }


    function safe96(uint n) internal {
        if(n >= 2**96) revert AmountError();
    }

    function safe32(uint n) internal {
        if(n >= 2**32) revert AmountError();
    }

    function setMaxStages(uint8 _maxStages) external onlyOwner {
        maxStages = _maxStages;
        emit SetMaxStages(_maxStages);
    }

    function setDeOrder(address _order) external onlyOwner {
        deOrder = _order;
        emit SetDeorder(_order);
    }

}