// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/ITask.sol";
import "./interface/IOrder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import '@uniswap/lib/contracts/libraries/TransferHelper.sol';
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "hardhat/console.sol";

// TODO:考虑阶段甲方确认后，修改后续阶段的问题
contract Order is IOrder, Ownable {

    enum OrderProgess {
        Init,
        Staging,   // Issuer Stage
        Staged,    // Worker Stage
        Started,
        IssuerAbort,
        WokerAbort,
        Done
    }

    struct Order {
        uint taskId;
        address worker;
        address token;
        uint amount;
        uint payed;
        OrderProgess progress;   // PROG_*
        uint startDate;
    }

    enum StageStatus {
        Init,
        Delivered,
        Accepted,
        Refused,
        Done       // withdrawed
    }


    //交付阶段
    struct Stage {
        uint amount;        // pay amount
        uint period;        // second
        StageStatus status;
        string milestone;   // TODO: only as event
        string delivery;    // TODO: only as event
    }

    uint8 private maxStages = 12;
    address private task;

    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;

    event OrderCreated(uint indexed orderId, uint indexed taskId, address indexed issuer, address worker, address token, uint amount);
    event OrderModified(uint orderId, address token, uint amount);
    event SetStage(uint indexed orderId, address worker, uint[] amounts, uint[] periods);
    event OrderStarted(uint taskId, uint orderId, address who);
    event ConfirmOrderStage(uint indexed orderId, address issuer, uint stageIndex);
    event OrderAbort(uint indexed orderId, address user, uint stageIndex);
    event Withdraw(uint indexed orderId, address worker, uint amount);
    event Delivery(address worker, uint orderId, uint stageIndex, string delivery);

    Counters.Counter private orderIds;



    // orderId  = > 
    mapping(uint => Order) public orders;

    // taskId = > orderId
    mapping(uint => uint[]) private taskOrders;
    // orderId = >
    mapping(uint => Stage[]) private orderStages;

    bytes32 public DOMAIN_SEPARATOR;
    bytes32 public constant PERMITSTAGE_TYPEHASH = keccak256("PermitStage(uint256 orderId,uint256[] amounts,uint256[] periods,uint256 deadline)");

    constructor(address _task) {
        task = _task;

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                // This should match the domain you set in your client side signing.
                keccak256(bytes("DetaskOrder")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    function createOrder(Order memory _order) external {
        require(msg.sender == ITask(task).ownerOf(_order.taskId), "No creating permission.");
        require(address(0) != _order.worker, "Worker is zero address.");

        orderIds.increment();
        uint orderId = orderIds.current();
        orders[orderId] = Order({
            taskId: _order.taskId,
            worker: _order.worker,
            token: _order.token,
            amount: _order.amount,
            progress: OrderProgess.Init,
            startDate: 0,
            payed: 0
        });

        emit OrderCreated(orderId, _order.taskId, msg.sender, _order.worker, _order.token, _order.amount);
    }

    function updateOrder(uint orderId, address token, uint amount) external {
        Order storage order = orders[orderId];
        require(order.progress < OrderProgess.Started, "PROG_STARTED");
        require(msg.sender == ITask(task).ownerOf(order.taskId), "No creating permission.");

        if (order.payed > 0 && orders[orderId].token != token) {
            refund(orderId, msg.sender, order.payed);
        }
        orders[orderId].token = token;
        orders[orderId].amount = amount;

        emit OrderModified(orderId, token, amount);
    }

    function payOrder(uint orderId, uint amount) external payable {
        Order storage order = orders[orderId];
        require(ITask(task).ownerOf(order.taskId) == msg.sender, "No permission.");

        uint needPayAnount = order.amount - order.payed;
        address token = order.token;

        if (token == address(0)) {
            order.payed += msg.value;
        } else {
            IERC20(token).safeTransferFrom(msg.sender, address(this), needPayAnount);
            order.payed += amount;
        }
    }



    function setStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods, string[] memory _milestones) external {
        Order storage order = orders[_orderId];
        require(order.progress < OrderProgess.Started, "PROG_STARTED");

        require(order.worker == msg.sender || ITask(task).ownerOf(order.taskId) == msg.sender, "No permission.");

        doSetStage(_orderId, _amounts, _periods, _milestones);
        if (order.worker == msg.sender) {
            order.progress = OrderProgess.Staged;
        } else {
            order.progress = OrderProgess.Staging;
        }

        emit SetStage(_orderId, msg.sender, _amounts, _periods);
    }

    function doSetStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods, string[] memory _milestones) internal {
        require(_amounts.length == _periods.length && _amounts.length != 0, "Wrong parameter length.");
        require(maxStages >= _amounts.length, "Wrong parameter length.");

        delete orderStages[_orderId];
        Stage[] storage stages = orderStages[_orderId];

        for ( uint i = 0; i < _periods.length; i++ ) {
            Stage memory pro = Stage ({
                amount: _amounts[i],
                period: _periods[i],
                milestone: _milestones[i],
                status: StageStatus.Init,
                delivery: ""
            });
            stages.push(pro);
        }
    }

    function appendStage(uint _orderId, uint amount, uint period, string calldata milestone, bytes calldata  _signature) external {
        

    }

    function prolongStage(uint _orderId, uint _stageIndex, uint newPeriod, bytes calldata _signature) external {
        
    }

    function stageDelivery(uint _orderId, uint _stageIndex, string calldata delivery) external {
        Stage[] storage stages = orderStages[_orderId];
        stages[_stageIndex].delivery = delivery;
        emit Delivery(msg.sender, _orderId, _stageIndex, delivery);
    }

    function checkAmount(uint orderId, Order storage order) internal {
        Stage[] storage stages = orderStages[orderId];
        uint total;
        for ( uint i = 0; i < stages.length; i++ ) {
            total += stages[i].amount;
        }

        require(total == order.amount, "amount mismatch");
    }


    function permitStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods, uint deadline, bytes memory _signature) public {
        bytes32 structHash = keccak256(abi.encode(PERMITSTAGE_TYPEHASH, _orderId, _amounts, _periods, deadline));
        bytes32 digest = ECDSA.toTypedDataHash(DOMAIN_SEPARATOR, structHash);

        address recoveredAddress = ECDSA.recover(digest, _signature);

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


    function issuerStartOrder(uint _orderId) external payable {
        Order storage order = orders[_orderId];
        uint taskId = order.taskId;
        require(msg.sender == ITask(task).ownerOf(taskId), "No permission.");
        require(order.progress == OrderProgess.Staged, "Need worker confirm");
        checkAmount(_orderId, order);

        uint needPayAnount = order.amount - order.payed;
        address _token = order.token;

        if (needPayAnount > 0) {
            if (_token == address(0)) {
                require(needPayAnount == msg.value, "pay error");
            } else {
                IERC20(_token).safeTransferFrom(msg.sender, address(this), needPayAnount);
            }
            order.payed = order.amount;
        }

        doStartOrder(_orderId, order);
    }

    function workerStartOrder(uint _orderId) external {
        Order storage order = orders[_orderId];
        uint taskId = order.taskId;
        require(order.worker == msg.sender, "No permission.");
        require(order.progress == OrderProgess.Staging, "Need Issuer confirm");
        require(order.payed >= order.amount, "Need Pay");

        checkAmount(_orderId, order);
        
        doStartOrder(_orderId, order);
    }


    function doStartOrder(uint _orderId, Order storage order) internal {
        order.progress = OrderProgess.Started;
        order.startDate = block.timestamp;

        Stage[] storage stages = orderStages[_orderId];
        if (stages[0].period == 0) {
            stages[0].status = StageStatus.Accepted;
        }

        taskOrders[order.taskId].push(_orderId);
        emit OrderStarted(order.taskId, _orderId, msg.sender);
    }

    // confirm must continuous
    function confirmOrderStage(uint _orderId, uint _stageIndex) external {
        uint taskId = orders[_orderId].taskId;
        require(msg.sender == ITask(task).ownerOf(taskId), "No confirming permission.");
        require(orderStages[_orderId][_stageIndex].status != StageStatus.Done, "Done");

        if (_stageIndex == 0) {
            orderStages[_orderId][_stageIndex].status = StageStatus.Accepted;
        } else {
            require(orderStages[_orderId][_stageIndex-1].status == StageStatus.Accepted, "The previous stage was not accepted");
            orderStages[_orderId][_stageIndex].status = StageStatus.Accepted;
        }
        
        emit ConfirmOrderStage(_orderId, msg.sender, _stageIndex);
    }

    function getOrderStages(uint _orderId) external view returns(Stage[] memory stages) {
        return orderStages[_orderId];
    }

    function getOngoingOrderStage(uint _orderId) public view returns (uint stageIndex, uint lastStageEnd) {
        Order memory order = orders[_orderId];
        lastStageEnd = order.startDate;
        require(order.progress == OrderProgess.Started, "UnOngoing");

        Stage[] storage stages = orderStages[_orderId];
        uint nowTs = block.timestamp;
        uint i = 0;
        for (; i < stages.length; i++) {
            Stage storage stage = stages[i];
            if(stage.status != StageStatus.Accepted && nowTs < lastStageEnd + stage.period) {
                stageIndex = i;
                return (stageIndex, lastStageEnd);
            }
            lastStageEnd += stage.period;
        }
        revert("Order Ended");
    }

    // Abort And Settle
    function abortOrder(uint _orderId) external {
        Order storage order = orders[_orderId];
        address issuer = ITask(task).ownerOf(order.taskId);
        require(order.worker == msg.sender || issuer == msg.sender, "No terminate permission.");

        (uint currStageIndex, uint lastStageEnd) = getOngoingOrderStage(_orderId);

        Stage[] storage stages = orderStages[_orderId];
        uint forWorkerAmount;
        uint forIssuerAmount;

        for (uint i = 0; i < currStageIndex; i++) {
            if(stages[i].status != StageStatus.Done) {
                forWorkerAmount += stages[i].amount;
                stages[i].status == StageStatus.Done;
            }
        }

        Stage storage stage = stages[currStageIndex];
        if (order.worker == msg.sender) {
            forIssuerAmount += stage.amount;
            order.progress = OrderProgess.WokerAbort;
        } else {
            forWorkerAmount += stage.amount * (block.timestamp - lastStageEnd) / stage.period;
            forIssuerAmount += stage.amount * (lastStageEnd + stage.period - block.timestamp) / stage.period;
            order.progress = OrderProgess.IssuerAbort;
        }
        stage.status = StageStatus.Refused;

        for (uint i = currStageIndex; i < stages.length; i++) {
            forIssuerAmount += stages[i].amount;
            stages[i].status == StageStatus.Refused;
        }

        doTransfer(order.token, issuer, forIssuerAmount);
        doTransfer(order.token, order.worker, forWorkerAmount);

        emit OrderAbort(_orderId, msg.sender, currStageIndex);
    }

    function refund(uint _orderId, address _to, uint _amount) public {
        Order storage order = orders[_orderId];
        require(msg.sender == ITask(task).ownerOf(order.taskId), "No permission.");

        order.payed -= _amount;
        doTransfer(order.token, _to, _amount);

        if(order.progress >= OrderProgess.Started) {
            require(order.payed >= order.amount, "refund too much");
        }
    }

    // TODO:项目需要抽成
    function withdraw(uint _orderId) external {
        Order storage order = orders[_orderId];
        require(order.worker == msg.sender, "No permission.");
        require(order.progress >= OrderProgess.Started, "order Unstarted");


        uint lastStageEnd = order.startDate;
        require(order.progress == OrderProgess.Started, "UnOngoing");

        Stage[] storage stages = orderStages[_orderId];
        uint nowTs = block.timestamp;
        uint pendingWithdraw;
        for ( uint i = 0; i < stages.length; i++) {
            Stage storage stage = stages[i];
            if(stage.status == StageStatus.Accepted || nowTs >= lastStageEnd + stage.period) {
                pendingWithdraw = stage.amount;
                stage.status = StageStatus.Done;
            }
            lastStageEnd += stage.period;
        }

        doTransfer(order.token, msg.sender, pendingWithdraw);

        emit Withdraw(_orderId, msg.sender, pendingWithdraw);
    }

    function hasTaskOrders(uint taskId) external view override  returns (bool hasTaskOrders_){
        uint[] memory ordersLength;
        ordersLength = taskOrders[taskId];
        if (ordersLength.length > 0) { 
            hasTaskOrders_ = true;
        } else {
            hasTaskOrders_ = false;
        } 
    }

    function modifyMaxStages(uint8 _maxStages) external onlyOwner {
        maxStages = _maxStages;
    }


    function doTransfer(address _token, address _to, uint _amount) private {
        if (_amount == 0) return;

        if (address(0) == _token) {
            TransferHelper.safeTransferETH(_to, _amount);
        } else {
            IERC20(_token).safeTransfer(_to, _amount);
        }
    }

}