// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class ApplyFor extends ethereum.Event {
  get params(): ApplyFor__Params {
    return new ApplyFor__Params(this);
  }
}

export class ApplyFor__Params {
  _event: ApplyFor;

  constructor(event: ApplyFor) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get worker(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get cost(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Approval extends ethereum.Event {
  get params(): Approval__Params {
    return new Approval__Params(this);
  }
}

export class Approval__Params {
  _event: Approval;

  constructor(event: Approval) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get approved(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class ApprovalForAll extends ethereum.Event {
  get params(): ApprovalForAll__Params {
    return new ApprovalForAll__Params(this);
  }
}

export class ApprovalForAll__Params {
  _event: ApprovalForAll;

  constructor(event: ApprovalForAll) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get operator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get approved(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }
}

export class CancelApply extends ethereum.Event {
  get params(): CancelApply__Params {
    return new CancelApply__Params(this);
  }
}

export class CancelApply__Params {
  _event: CancelApply;

  constructor(event: CancelApply) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get worker(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Locked extends ethereum.Event {
  get params(): Locked__Params {
    return new Locked__Params(this);
  }
}

export class Locked__Params {
  _event: Locked;

  constructor(event: Locked) {
    this._event = event;
  }

  get tokenId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class ModifyFee extends ethereum.Event {
  get params(): ModifyFee__Params {
    return new ModifyFee__Params(this);
  }
}

export class ModifyFee__Params {
  _event: ModifyFee;

  constructor(event: ModifyFee) {
    this._event = event;
  }

  get taskFee(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get applyFee(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get feeReceiver(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class TaskCreated extends ethereum.Event {
  get params(): TaskCreated__Params {
    return new TaskCreated__Params(this);
  }
}

export class TaskCreated__Params {
  _event: TaskCreated;

  constructor(event: TaskCreated) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get issuer(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get task(): TaskCreatedTaskStruct {
    return changetype<TaskCreatedTaskStruct>(
      this._event.parameters[2].value.toTuple()
    );
  }
}

export class TaskCreatedTaskStruct extends ethereum.Tuple {
  get title(): string {
    return this[0].toString();
  }

  get desc(): string {
    return this[1].toString();
  }

  get attachment(): string {
    return this[2].toString();
  }

  get currency(): i32 {
    return this[3].toI32();
  }

  get budget(): BigInt {
    return this[4].toBigInt();
  }

  get period(): BigInt {
    return this[5].toBigInt();
  }

  get skills(): BigInt {
    return this[6].toBigInt();
  }

  get disabled(): boolean {
    return this[7].toBoolean();
  }
}

export class TaskDisabled extends ethereum.Event {
  get params(): TaskDisabled__Params {
    return new TaskDisabled__Params(this);
  }
}

export class TaskDisabled__Params {
  _event: TaskDisabled;

  constructor(event: TaskDisabled) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get disabled(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }
}

export class TaskModified extends ethereum.Event {
  get params(): TaskModified__Params {
    return new TaskModified__Params(this);
  }
}

export class TaskModified__Params {
  _event: TaskModified;

  constructor(event: TaskModified) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get issuer(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get task(): TaskModifiedTaskStruct {
    return changetype<TaskModifiedTaskStruct>(
      this._event.parameters[2].value.toTuple()
    );
  }
}

export class TaskModifiedTaskStruct extends ethereum.Tuple {
  get title(): string {
    return this[0].toString();
  }

  get desc(): string {
    return this[1].toString();
  }

  get attachment(): string {
    return this[2].toString();
  }

  get currency(): i32 {
    return this[3].toI32();
  }

  get budget(): BigInt {
    return this[4].toBigInt();
  }

  get period(): BigInt {
    return this[5].toBigInt();
  }

  get skills(): BigInt {
    return this[6].toBigInt();
  }

  get disabled(): boolean {
    return this[7].toBoolean();
  }
}

export class Transfer extends ethereum.Event {
  get params(): Transfer__Params {
    return new Transfer__Params(this);
  }
}

export class Transfer__Params {
  _event: Transfer;

  constructor(event: Transfer) {
    this._event = event;
  }

  get from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Unlocked extends ethereum.Event {
  get params(): Unlocked__Params {
    return new Unlocked__Params(this);
  }
}

export class Unlocked__Params {
  _event: Unlocked;

  constructor(event: Unlocked) {
    this._event = event;
  }

  get tokenId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class Contract__tasksResult {
  value0: string;
  value1: string;
  value2: string;
  value3: i32;
  value4: BigInt;
  value5: BigInt;
  value6: BigInt;
  value7: boolean;

  constructor(
    value0: string,
    value1: string,
    value2: string,
    value3: i32,
    value4: BigInt,
    value5: BigInt,
    value6: BigInt,
    value7: boolean
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
    this.value6 = value6;
    this.value7 = value7;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromString(this.value0));
    map.set("value1", ethereum.Value.fromString(this.value1));
    map.set("value2", ethereum.Value.fromString(this.value2));
    map.set(
      "value3",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value3))
    );
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    map.set("value5", ethereum.Value.fromUnsignedBigInt(this.value5));
    map.set("value6", ethereum.Value.fromUnsignedBigInt(this.value6));
    map.set("value7", ethereum.Value.fromBoolean(this.value7));
    return map;
  }

  getTitle(): string {
    return this.value0;
  }

  getDesc(): string {
    return this.value1;
  }

  getAttachment(): string {
    return this.value2;
  }

  getCurrency(): i32 {
    return this.value3;
  }

  getBudget(): BigInt {
    return this.value4;
  }

  getPeriod(): BigInt {
    return this.value5;
  }

  getSkills(): BigInt {
    return this.value6;
  }

  getDisabled(): boolean {
    return this.value7;
  }
}

export class Contract extends ethereum.SmartContract {
  static bind(address: Address): Contract {
    return new Contract("Contract", address);
  }

  balanceOf(owner: Address): BigInt {
    let result = super.call("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(owner)
    ]);

    return result[0].toBigInt();
  }

  try_balanceOf(owner: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(owner)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getApproved(param0: BigInt): Address {
    let result = super.call("getApproved", "getApproved(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);

    return result[0].toAddress();
  }

  try_getApproved(param0: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getApproved",
      "getApproved(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  isApprovedForAll(param0: Address, param1: Address): boolean {
    let result = super.call(
      "isApprovedForAll",
      "isApprovedForAll(address,address):(bool)",
      [ethereum.Value.fromAddress(param0), ethereum.Value.fromAddress(param1)]
    );

    return result[0].toBoolean();
  }

  try_isApprovedForAll(
    param0: Address,
    param1: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isApprovedForAll",
      "isApprovedForAll(address,address):(bool)",
      [ethereum.Value.fromAddress(param0), ethereum.Value.fromAddress(param1)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  locked(tokenId: BigInt): boolean {
    let result = super.call("locked", "locked(uint256):(bool)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);

    return result[0].toBoolean();
  }

  try_locked(tokenId: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall("locked", "locked(uint256):(bool)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  metadataAddr(): Address {
    let result = super.call("metadataAddr", "metadataAddr():(address)", []);

    return result[0].toAddress();
  }

  try_metadataAddr(): ethereum.CallResult<Address> {
    let result = super.tryCall("metadataAddr", "metadataAddr():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  name(): string {
    let result = super.call("name", "name():(string)", []);

    return result[0].toString();
  }

  try_name(): ethereum.CallResult<string> {
    let result = super.tryCall("name", "name():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  order(): Address {
    let result = super.call("order", "order():(address)", []);

    return result[0].toAddress();
  }

  try_order(): ethereum.CallResult<Address> {
    let result = super.tryCall("order", "order():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  ownerOf(tokenId: BigInt): Address {
    let result = super.call("ownerOf", "ownerOf(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);

    return result[0].toAddress();
  }

  try_ownerOf(tokenId: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall("ownerOf", "ownerOf(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  supportsInterface(interfaceId: Bytes): boolean {
    let result = super.call(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );

    return result[0].toBoolean();
  }

  try_supportsInterface(interfaceId: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  symbol(): string {
    let result = super.call("symbol", "symbol():(string)", []);

    return result[0].toString();
  }

  try_symbol(): ethereum.CallResult<string> {
    let result = super.tryCall("symbol", "symbol():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  tasks(param0: BigInt): Contract__tasksResult {
    let result = super.call(
      "tasks",
      "tasks(uint256):(string,string,string,uint8,uint112,uint32,uint48,bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new Contract__tasksResult(
      result[0].toString(),
      result[1].toString(),
      result[2].toString(),
      result[3].toI32(),
      result[4].toBigInt(),
      result[5].toBigInt(),
      result[6].toBigInt(),
      result[7].toBoolean()
    );
  }

  try_tasks(param0: BigInt): ethereum.CallResult<Contract__tasksResult> {
    let result = super.tryCall(
      "tasks",
      "tasks(uint256):(string,string,string,uint8,uint112,uint32,uint48,bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new Contract__tasksResult(
        value[0].toString(),
        value[1].toString(),
        value[2].toString(),
        value[3].toI32(),
        value[4].toBigInt(),
        value[5].toBigInt(),
        value[6].toBigInt(),
        value[7].toBoolean()
      )
    );
  }

  tokenURI(tokenId: BigInt): string {
    let result = super.call("tokenURI", "tokenURI(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);

    return result[0].toString();
  }

  try_tokenURI(tokenId: BigInt): ethereum.CallResult<string> {
    let result = super.tryCall("tokenURI", "tokenURI(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ApplyAndCancelCall extends ethereum.Call {
  get inputs(): ApplyAndCancelCall__Inputs {
    return new ApplyAndCancelCall__Inputs(this);
  }

  get outputs(): ApplyAndCancelCall__Outputs {
    return new ApplyAndCancelCall__Outputs(this);
  }
}

export class ApplyAndCancelCall__Inputs {
  _call: ApplyAndCancelCall;

  constructor(call: ApplyAndCancelCall) {
    this._call = call;
  }

  get who(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _taskIds(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }

  get costs(): Array<BigInt> {
    return this._call.inputValues[2].value.toBigIntArray();
  }

  get cancelIds(): Array<BigInt> {
    return this._call.inputValues[3].value.toBigIntArray();
  }
}

export class ApplyAndCancelCall__Outputs {
  _call: ApplyAndCancelCall;

  constructor(call: ApplyAndCancelCall) {
    this._call = call;
  }
}

export class ApplyForCall extends ethereum.Call {
  get inputs(): ApplyForCall__Inputs {
    return new ApplyForCall__Inputs(this);
  }

  get outputs(): ApplyForCall__Outputs {
    return new ApplyForCall__Outputs(this);
  }
}

export class ApplyForCall__Inputs {
  _call: ApplyForCall;

  constructor(call: ApplyForCall) {
    this._call = call;
  }

  get who(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get taskId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _cost(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class ApplyForCall__Outputs {
  _call: ApplyForCall;

  constructor(call: ApplyForCall) {
    this._call = call;
  }
}

export class ApproveCall extends ethereum.Call {
  get inputs(): ApproveCall__Inputs {
    return new ApproveCall__Inputs(this);
  }

  get outputs(): ApproveCall__Outputs {
    return new ApproveCall__Outputs(this);
  }
}

export class ApproveCall__Inputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get value1(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class ApproveCall__Outputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }
}

export class CancelApplyCall extends ethereum.Call {
  get inputs(): CancelApplyCall__Inputs {
    return new CancelApplyCall__Inputs(this);
  }

  get outputs(): CancelApplyCall__Outputs {
    return new CancelApplyCall__Outputs(this);
  }
}

export class CancelApplyCall__Inputs {
  _call: CancelApplyCall;

  constructor(call: CancelApplyCall) {
    this._call = call;
  }

  get taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class CancelApplyCall__Outputs {
  _call: CancelApplyCall;

  constructor(call: CancelApplyCall) {
    this._call = call;
  }
}

export class CreateTaskCall extends ethereum.Call {
  get inputs(): CreateTaskCall__Inputs {
    return new CreateTaskCall__Inputs(this);
  }

  get outputs(): CreateTaskCall__Outputs {
    return new CreateTaskCall__Outputs(this);
  }
}

export class CreateTaskCall__Inputs {
  _call: CreateTaskCall;

  constructor(call: CreateTaskCall) {
    this._call = call;
  }

  get who(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get task(): CreateTaskCallTaskStruct {
    return changetype<CreateTaskCallTaskStruct>(
      this._call.inputValues[1].value.toTuple()
    );
  }
}

export class CreateTaskCall__Outputs {
  _call: CreateTaskCall;

  constructor(call: CreateTaskCall) {
    this._call = call;
  }
}

export class CreateTaskCallTaskStruct extends ethereum.Tuple {
  get title(): string {
    return this[0].toString();
  }

  get desc(): string {
    return this[1].toString();
  }

  get attachment(): string {
    return this[2].toString();
  }

  get currency(): i32 {
    return this[3].toI32();
  }

  get budget(): BigInt {
    return this[4].toBigInt();
  }

  get period(): BigInt {
    return this[5].toBigInt();
  }

  get skills(): BigInt {
    return this[6].toBigInt();
  }

  get disabled(): boolean {
    return this[7].toBoolean();
  }
}

export class DisableTaskCall extends ethereum.Call {
  get inputs(): DisableTaskCall__Inputs {
    return new DisableTaskCall__Inputs(this);
  }

  get outputs(): DisableTaskCall__Outputs {
    return new DisableTaskCall__Outputs(this);
  }
}

export class DisableTaskCall__Inputs {
  _call: DisableTaskCall;

  constructor(call: DisableTaskCall) {
    this._call = call;
  }

  get taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _disabled(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class DisableTaskCall__Outputs {
  _call: DisableTaskCall;

  constructor(call: DisableTaskCall) {
    this._call = call;
  }
}

export class ModifyTaskCall extends ethereum.Call {
  get inputs(): ModifyTaskCall__Inputs {
    return new ModifyTaskCall__Inputs(this);
  }

  get outputs(): ModifyTaskCall__Outputs {
    return new ModifyTaskCall__Outputs(this);
  }
}

export class ModifyTaskCall__Inputs {
  _call: ModifyTaskCall;

  constructor(call: ModifyTaskCall) {
    this._call = call;
  }

  get taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get task(): ModifyTaskCallTaskStruct {
    return changetype<ModifyTaskCallTaskStruct>(
      this._call.inputValues[1].value.toTuple()
    );
  }
}

export class ModifyTaskCall__Outputs {
  _call: ModifyTaskCall;

  constructor(call: ModifyTaskCall) {
    this._call = call;
  }
}

export class ModifyTaskCallTaskStruct extends ethereum.Tuple {
  get title(): string {
    return this[0].toString();
  }

  get desc(): string {
    return this[1].toString();
  }

  get attachment(): string {
    return this[2].toString();
  }

  get currency(): i32 {
    return this[3].toI32();
  }

  get budget(): BigInt {
    return this[4].toBigInt();
  }

  get period(): BigInt {
    return this[5].toBigInt();
  }

  get skills(): BigInt {
    return this[6].toBigInt();
  }

  get disabled(): boolean {
    return this[7].toBoolean();
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SafeTransferFromCall extends ethereum.Call {
  get inputs(): SafeTransferFromCall__Inputs {
    return new SafeTransferFromCall__Inputs(this);
  }

  get outputs(): SafeTransferFromCall__Outputs {
    return new SafeTransferFromCall__Outputs(this);
  }
}

export class SafeTransferFromCall__Inputs {
  _call: SafeTransferFromCall;

  constructor(call: SafeTransferFromCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get value1(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get value2(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class SafeTransferFromCall__Outputs {
  _call: SafeTransferFromCall;

  constructor(call: SafeTransferFromCall) {
    this._call = call;
  }
}

export class SafeTransferFrom1Call extends ethereum.Call {
  get inputs(): SafeTransferFrom1Call__Inputs {
    return new SafeTransferFrom1Call__Inputs(this);
  }

  get outputs(): SafeTransferFrom1Call__Outputs {
    return new SafeTransferFrom1Call__Outputs(this);
  }
}

export class SafeTransferFrom1Call__Inputs {
  _call: SafeTransferFrom1Call;

  constructor(call: SafeTransferFrom1Call) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get value1(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get value2(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get value3(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class SafeTransferFrom1Call__Outputs {
  _call: SafeTransferFrom1Call;

  constructor(call: SafeTransferFrom1Call) {
    this._call = call;
  }
}

export class SetApprovalForAllCall extends ethereum.Call {
  get inputs(): SetApprovalForAllCall__Inputs {
    return new SetApprovalForAllCall__Inputs(this);
  }

  get outputs(): SetApprovalForAllCall__Outputs {
    return new SetApprovalForAllCall__Outputs(this);
  }
}

export class SetApprovalForAllCall__Inputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get value1(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class SetApprovalForAllCall__Outputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }
}

export class SetMetadataContractCall extends ethereum.Call {
  get inputs(): SetMetadataContractCall__Inputs {
    return new SetMetadataContractCall__Inputs(this);
  }

  get outputs(): SetMetadataContractCall__Outputs {
    return new SetMetadataContractCall__Outputs(this);
  }
}

export class SetMetadataContractCall__Inputs {
  _call: SetMetadataContractCall;

  constructor(call: SetMetadataContractCall) {
    this._call = call;
  }

  get _meta(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetMetadataContractCall__Outputs {
  _call: SetMetadataContractCall;

  constructor(call: SetMetadataContractCall) {
    this._call = call;
  }
}

export class SetOrderCall extends ethereum.Call {
  get inputs(): SetOrderCall__Inputs {
    return new SetOrderCall__Inputs(this);
  }

  get outputs(): SetOrderCall__Outputs {
    return new SetOrderCall__Outputs(this);
  }
}

export class SetOrderCall__Inputs {
  _call: SetOrderCall;

  constructor(call: SetOrderCall) {
    this._call = call;
  }

  get _order(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetOrderCall__Outputs {
  _call: SetOrderCall;

  constructor(call: SetOrderCall) {
    this._call = call;
  }
}

export class TransferFeeCall extends ethereum.Call {
  get inputs(): TransferFeeCall__Inputs {
    return new TransferFeeCall__Inputs(this);
  }

  get outputs(): TransferFeeCall__Outputs {
    return new TransferFeeCall__Outputs(this);
  }
}

export class TransferFeeCall__Inputs {
  _call: TransferFeeCall;

  constructor(call: TransferFeeCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class TransferFeeCall__Outputs {
  _call: TransferFeeCall;

  constructor(call: TransferFeeCall) {
    this._call = call;
  }
}

export class TransferFromCall extends ethereum.Call {
  get inputs(): TransferFromCall__Inputs {
    return new TransferFromCall__Inputs(this);
  }

  get outputs(): TransferFromCall__Outputs {
    return new TransferFromCall__Outputs(this);
  }
}

export class TransferFromCall__Inputs {
  _call: TransferFromCall;

  constructor(call: TransferFromCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get value1(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get value2(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class TransferFromCall__Outputs {
  _call: TransferFromCall;

  constructor(call: TransferFromCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class UpdateFeeReceiverCall extends ethereum.Call {
  get inputs(): UpdateFeeReceiverCall__Inputs {
    return new UpdateFeeReceiverCall__Inputs(this);
  }

  get outputs(): UpdateFeeReceiverCall__Outputs {
    return new UpdateFeeReceiverCall__Outputs(this);
  }
}

export class UpdateFeeReceiverCall__Inputs {
  _call: UpdateFeeReceiverCall;

  constructor(call: UpdateFeeReceiverCall) {
    this._call = call;
  }

  get _taskFee(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _applyFee(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _receiver(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class UpdateFeeReceiverCall__Outputs {
  _call: UpdateFeeReceiverCall;

  constructor(call: UpdateFeeReceiverCall) {
    this._call = call;
  }
}
