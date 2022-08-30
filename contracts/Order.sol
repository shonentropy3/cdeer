// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/ITask.sol";
import "./interface/IOrder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import './libs/TransferHelper.sol';
import "./libs/ECDSA.sol";


contract Order is IOrder, Ownable {
    error PermissionsError();

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
        // string milestone;   // TODO: only as event
        string delivery;    // TODO: only as event
    }

    uint8 private maxStages = 12;
    address private task;

    event OrderCreated(uint indexed orderId, uint taskId, address issuer, address worker, address token, uint amount);
    event OrderModified(uint indexed orderId, address token, uint amount);
    event SetStage(uint indexed orderId, uint[] amounts, uint[] periods);
    event OrderStarted(uint taskId, uint orderId, address who);
    event ConfirmOrderStage(uint indexed orderId, uint stageIndex);
    event OrderAbort(uint indexed orderId, address who, uint stageIndex);
    event Withdraw(uint indexed orderId, uint amount);
    event Delivery(uint indexed orderId, uint stageIndex, string delivery);

    uint private currOrderId;

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

        currOrderId += 1;
        orders[currOrderId] = Order({
            taskId: _order.taskId,
            worker: _order.worker,
            token: _order.token,
            amount: _order.amount,
            progress: OrderProgess.Init,
            startDate: 0,
            payed: 0
        });

        emit OrderCreated(currOrderId, _order.taskId, msg.sender, _order.worker, _order.token, _order.amount);
    }

    function updateOrder(uint orderId, address token, uint amount) external {
        Order storage order = orders[orderId];
        require(order.progress < OrderProgess.Started, "PROG_STARTED");
        if(msg.sender != ITask(task).ownerOf(order.taskId)) revert PermissionsError(); 

        if (order.payed > 0 && orders[orderId].token != token) {
            refund(orderId, msg.sender, order.payed);
        }
        orders[orderId].token = token;
        orders[orderId].amount = amount;

        emit OrderModified(orderId, token, amount);
    }

    function payOrder(uint orderId, uint amount) external payable {
        Order storage order = orders[orderId];
        if(msg.sender != ITask(task).ownerOf(order.taskId)) revert PermissionsError(); 

        uint needPayAmount = order.amount - order.payed;
        address token = order.token;

        if (token == address(0)) {
            order.payed += msg.value;
        } else {
            TransferHelper.safeTransferFrom(token, msg.sender, address(this), needPayAmount);
            order.payed += amount;
        }
    }

    function setStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods, string[] memory _milestones) external {
        Order storage order = orders[_orderId];
        require(order.progress < OrderProgess.Started, "PROG_STARTED");

        if(order.worker != msg.sender && ITask(task).ownerOf(order.taskId) != msg.sender) revert PermissionsError();

        doSetStage(_orderId, _amounts, _periods, _milestones);
        if (order.worker == msg.sender) {
            order.progress = OrderProgess.Staged;
        } else {
            order.progress = OrderProgess.Staging;
        }

        emit SetStage(_orderId, _amounts, _periods);
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
                // milestone: _milestones[i],
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
        emit Delivery(_orderId, _stageIndex, delivery);
    }

    function checkAmount(uint orderId, Order storage order) internal {
        Stage[] storage stages = orderStages[orderId];
        uint total;
        for ( uint i = 0; i < stages.length; i++ ) {
            total += stages[i].amount;
        }

        require(total == order.amount, "amount mismatch");
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
        require(recoveredAddress == address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266), "Invalid Signature");
        
        // Order storage order = orders[_orderId];
        // require(order.worker == recoveredAddress, "Invalid Worker Signature");
        
        // Stage[] storage stages = orderStages[_orderId];

        // require(stages.length == _periods.length && _periods.length == _amounts.length, "mismatch");
        
        // for ( uint i = 0; i < stages.length; i++) {
        //     require(_amounts[i] == stages[i].amount, "mismatch amount");
        //     require(_periods[i] == stages[i].period, "mismatch period");
        // }

        // order.progress = OrderProgess.Staged;
        // console.log("recoveredAddress", recoveredAddress);

    }


    function issuerStartOrder(uint _orderId) external payable {
        Order storage order = orders[_orderId];
        uint taskId = order.taskId;
        if(msg.sender != ITask(task).ownerOf(taskId)) revert PermissionsError(); 
        require(order.progress == OrderProgess.Staged, "Need worker confirm");
        checkAmount(_orderId, order);

        uint needPayAmount = order.amount - order.payed;
        address _token = order.token;

        if (needPayAmount > 0) {
            if (_token == address(0)) {
                require(needPayAmount == msg.value, "pay error");
            } else {
                TransferHelper.safeTransferFrom(_token, msg.sender, address(this), needPayAmount);
            }
            order.payed = order.amount;
        }

        doStartOrder(_orderId, order);
    }

    function workerStartOrder(uint _orderId) external {
        Order storage order = orders[_orderId];
        uint taskId = order.taskId;
        if(msg.sender != order.worker ) revert PermissionsError(); 
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
        if(order.worker != msg.sender && issuer != msg.sender) revert PermissionsError(); 

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
        if(msg.sender != ITask(task).ownerOf(order.taskId)) revert PermissionsError(); 

        order.payed -= _amount;
        doTransfer(order.token, _to, _amount);

        if(order.progress >= OrderProgess.Started) {
            require(order.payed >= order.amount, "refund too much");
        }
    }

    // TODO:项目需要抽成
    function withdraw(uint _orderId) external {
        Order storage order = orders[_orderId];
        if(order.worker != msg.sender) revert PermissionsError(); 
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

        emit Withdraw(_orderId, pendingWithdraw);
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
            TransferHelper.safeTransfer(_token, _to, _amount);
        }
    }

}