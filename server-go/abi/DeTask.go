// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package abi

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
)

// TaskInfo is an auto generated low-level Go binding around an user-defined struct.
type TaskInfo struct {
	Title      string
	Desc       string
	Attachment string
	Currency   uint8
	Budget     *big.Int
	Period     uint32
	Skills     *big.Int
	Timestamp  uint32
	Disabled   bool
}

// DeTaskMetaData contains all meta data concerning the DeTask contract.
var DeTaskMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"worker\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"cost\",\"type\":\"uint256\"}],\"name\":\"ApplyFor\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"approved\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"}],\"name\":\"ApprovalForAll\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"worker\",\"type\":\"address\"}],\"name\":\"CancelApply\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Locked\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"taskFee\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"applyFee\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"feeReceiver\",\"type\":\"address\"}],\"name\":\"ModifyFee\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"issuer\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"title\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"desc\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"attachment\",\"type\":\"string\"},{\"internalType\":\"uint8\",\"name\":\"currency\",\"type\":\"uint8\"},{\"internalType\":\"uint128\",\"name\":\"budget\",\"type\":\"uint128\"},{\"internalType\":\"uint32\",\"name\":\"period\",\"type\":\"uint32\"},{\"internalType\":\"uint48\",\"name\":\"skills\",\"type\":\"uint48\"},{\"internalType\":\"uint32\",\"name\":\"timestamp\",\"type\":\"uint32\"},{\"internalType\":\"bool\",\"name\":\"disabled\",\"type\":\"bool\"}],\"indexed\":false,\"internalType\":\"structTaskInfo\",\"name\":\"task\",\"type\":\"tuple\"}],\"name\":\"TaskCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"disabled\",\"type\":\"bool\"}],\"name\":\"TaskDisabled\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"issuer\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"title\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"desc\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"attachment\",\"type\":\"string\"},{\"internalType\":\"uint8\",\"name\":\"currency\",\"type\":\"uint8\"},{\"internalType\":\"uint128\",\"name\":\"budget\",\"type\":\"uint128\"},{\"internalType\":\"uint32\",\"name\":\"period\",\"type\":\"uint32\"},{\"internalType\":\"uint48\",\"name\":\"skills\",\"type\":\"uint48\"},{\"internalType\":\"uint32\",\"name\":\"timestamp\",\"type\":\"uint32\"},{\"internalType\":\"bool\",\"name\":\"disabled\",\"type\":\"bool\"}],\"indexed\":false,\"internalType\":\"structTaskInfo\",\"name\":\"task\",\"type\":\"tuple\"}],\"name\":\"TaskModified\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Unlocked\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"who\",\"type\":\"address\"},{\"internalType\":\"uint256[]\",\"name\":\"_taskIds\",\"type\":\"uint256[]\"},{\"internalType\":\"uint256[]\",\"name\":\"costs\",\"type\":\"uint256[]\"},{\"internalType\":\"uint256[]\",\"name\":\"cancelIds\",\"type\":\"uint256[]\"}],\"name\":\"applyAndCancel\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"who\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_cost\",\"type\":\"uint256\"}],\"name\":\"applyFor\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"}],\"name\":\"cancelApply\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"who\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"title\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"desc\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"attachment\",\"type\":\"string\"},{\"internalType\":\"uint8\",\"name\":\"currency\",\"type\":\"uint8\"},{\"internalType\":\"uint128\",\"name\":\"budget\",\"type\":\"uint128\"},{\"internalType\":\"uint32\",\"name\":\"period\",\"type\":\"uint32\"},{\"internalType\":\"uint48\",\"name\":\"skills\",\"type\":\"uint48\"},{\"internalType\":\"uint32\",\"name\":\"timestamp\",\"type\":\"uint32\"},{\"internalType\":\"bool\",\"name\":\"disabled\",\"type\":\"bool\"}],\"internalType\":\"structTaskInfo\",\"name\":\"task\",\"type\":\"tuple\"}],\"name\":\"createTask\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"_disabled\",\"type\":\"bool\"}],\"name\":\"disableTask\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"getApproved\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"}],\"name\":\"getTaskInfo\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"title\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"desc\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"attachment\",\"type\":\"string\"},{\"internalType\":\"uint8\",\"name\":\"currency\",\"type\":\"uint8\"},{\"internalType\":\"uint128\",\"name\":\"budget\",\"type\":\"uint128\"},{\"internalType\":\"uint32\",\"name\":\"period\",\"type\":\"uint32\"},{\"internalType\":\"uint48\",\"name\":\"skills\",\"type\":\"uint48\"},{\"internalType\":\"uint32\",\"name\":\"timestamp\",\"type\":\"uint32\"},{\"internalType\":\"bool\",\"name\":\"disabled\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"isApprovedForAll\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"locked\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"metadataAddr\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"title\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"desc\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"attachment\",\"type\":\"string\"},{\"internalType\":\"uint8\",\"name\":\"currency\",\"type\":\"uint8\"},{\"internalType\":\"uint128\",\"name\":\"budget\",\"type\":\"uint128\"},{\"internalType\":\"uint32\",\"name\":\"period\",\"type\":\"uint32\"},{\"internalType\":\"uint48\",\"name\":\"skills\",\"type\":\"uint48\"},{\"internalType\":\"uint32\",\"name\":\"timestamp\",\"type\":\"uint32\"},{\"internalType\":\"bool\",\"name\":\"disabled\",\"type\":\"bool\"}],\"internalType\":\"structTaskInfo\",\"name\":\"task\",\"type\":\"tuple\"}],\"name\":\"modifyTask\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"order\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"ownerOf\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"name\":\"setApprovalForAll\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_meta\",\"type\":\"address\"}],\"name\":\"setMetadataContract\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_order\",\"type\":\"address\"}],\"name\":\"setOrder\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"interfaceId\",\"type\":\"bytes4\"}],\"name\":\"supportsInterface\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"tasks\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"title\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"desc\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"attachment\",\"type\":\"string\"},{\"internalType\":\"uint8\",\"name\":\"currency\",\"type\":\"uint8\"},{\"internalType\":\"uint128\",\"name\":\"budget\",\"type\":\"uint128\"},{\"internalType\":\"uint32\",\"name\":\"period\",\"type\":\"uint32\"},{\"internalType\":\"uint48\",\"name\":\"skills\",\"type\":\"uint48\"},{\"internalType\":\"uint32\",\"name\":\"timestamp\",\"type\":\"uint32\"},{\"internalType\":\"bool\",\"name\":\"disabled\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"tokenURI\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transferFee\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_taskFee\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_applyFee\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"_receiver\",\"type\":\"address\"}],\"name\":\"updateFeeReceiver\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
}

// DeTaskABI is the input ABI used to generate the binding from.
// Deprecated: Use DeTaskMetaData.ABI instead.
var DeTaskABI = DeTaskMetaData.ABI

// DeTask is an auto generated Go binding around an Ethereum contract.
type DeTask struct {
	DeTaskCaller     // Read-only binding to the contract
	DeTaskTransactor // Write-only binding to the contract
	DeTaskFilterer   // Log filterer for contract events
}

// DeTaskCaller is an auto generated read-only Go binding around an Ethereum contract.
type DeTaskCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// DeTaskTransactor is an auto generated write-only Go binding around an Ethereum contract.
type DeTaskTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// DeTaskFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type DeTaskFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// DeTaskSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type DeTaskSession struct {
	Contract     *DeTask           // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// DeTaskCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type DeTaskCallerSession struct {
	Contract *DeTaskCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts // Call options to use throughout this session
}

// DeTaskTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type DeTaskTransactorSession struct {
	Contract     *DeTaskTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// DeTaskRaw is an auto generated low-level Go binding around an Ethereum contract.
type DeTaskRaw struct {
	Contract *DeTask // Generic contract binding to access the raw methods on
}

// DeTaskCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type DeTaskCallerRaw struct {
	Contract *DeTaskCaller // Generic read-only contract binding to access the raw methods on
}

// DeTaskTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type DeTaskTransactorRaw struct {
	Contract *DeTaskTransactor // Generic write-only contract binding to access the raw methods on
}

// NewDeTask creates a new instance of DeTask, bound to a specific deployed contract.
func NewDeTask(address common.Address, backend bind.ContractBackend) (*DeTask, error) {
	contract, err := bindDeTask(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &DeTask{DeTaskCaller: DeTaskCaller{contract: contract}, DeTaskTransactor: DeTaskTransactor{contract: contract}, DeTaskFilterer: DeTaskFilterer{contract: contract}}, nil
}

// NewDeTaskCaller creates a new read-only instance of DeTask, bound to a specific deployed contract.
func NewDeTaskCaller(address common.Address, caller bind.ContractCaller) (*DeTaskCaller, error) {
	contract, err := bindDeTask(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &DeTaskCaller{contract: contract}, nil
}

// NewDeTaskTransactor creates a new write-only instance of DeTask, bound to a specific deployed contract.
func NewDeTaskTransactor(address common.Address, transactor bind.ContractTransactor) (*DeTaskTransactor, error) {
	contract, err := bindDeTask(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &DeTaskTransactor{contract: contract}, nil
}

// NewDeTaskFilterer creates a new log filterer instance of DeTask, bound to a specific deployed contract.
func NewDeTaskFilterer(address common.Address, filterer bind.ContractFilterer) (*DeTaskFilterer, error) {
	contract, err := bindDeTask(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &DeTaskFilterer{contract: contract}, nil
}

// bindDeTask binds a generic wrapper to an already deployed contract.
func bindDeTask(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(DeTaskABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_DeTask *DeTaskRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _DeTask.Contract.DeTaskCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_DeTask *DeTaskRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _DeTask.Contract.DeTaskTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_DeTask *DeTaskRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _DeTask.Contract.DeTaskTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_DeTask *DeTaskCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _DeTask.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_DeTask *DeTaskTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _DeTask.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_DeTask *DeTaskTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _DeTask.Contract.contract.Transact(opts, method, params...)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address owner) view returns(uint256)
func (_DeTask *DeTaskCaller) BalanceOf(opts *bind.CallOpts, owner common.Address) (*big.Int, error) {
	var out []interface{}
	err := _DeTask.contract.Call(opts, &out, "balanceOf", owner)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address owner) view returns(uint256)
func (_DeTask *DeTaskSession) BalanceOf(owner common.Address) (*big.Int, error) {
	return _DeTask.Contract.BalanceOf(&_DeTask.CallOpts, owner)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address owner) view returns(uint256)
func (_DeTask *DeTaskCallerSession) BalanceOf(owner common.Address) (*big.Int, error) {
	return _DeTask.Contract.BalanceOf(&_DeTask.CallOpts, owner)
}

// GetApproved is a free data retrieval call binding the contract method 0x081812fc.
//
// Solidity: function getApproved(uint256 ) view returns(address)
func (_DeTask *DeTaskCaller) GetApproved(opts *bind.CallOpts, arg0 *big.Int) (common.Address, error) {
	var out []interface{}
	err := _DeTask.contract.Call(opts, &out, "getApproved", arg0)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetApproved is a free data retrieval call binding the contract method 0x081812fc.
//
// Solidity: function getApproved(uint256 ) view returns(address)
func (_DeTask *DeTaskSession) GetApproved(arg0 *big.Int) (common.Address, error) {
	return _DeTask.Contract.GetApproved(&_DeTask.CallOpts, arg0)
}

// GetApproved is a free data retrieval call binding the contract method 0x081812fc.
//
// Solidity: function getApproved(uint256 ) view returns(address)
func (_DeTask *DeTaskCallerSession) GetApproved(arg0 *big.Int) (common.Address, error) {
	return _DeTask.Contract.GetApproved(&_DeTask.CallOpts, arg0)
}

// GetTaskInfo is a free data retrieval call binding the contract method 0xd1a1b999.
//
// Solidity: function getTaskInfo(uint256 taskId) view returns(string title, string desc, string attachment, uint8 currency, uint128 budget, uint32 period, uint48 skills, uint32 timestamp, bool disabled)
func (_DeTask *DeTaskCaller) GetTaskInfo(opts *bind.CallOpts, taskId *big.Int) (struct {
	Title      string
	Desc       string
	Attachment string
	Currency   uint8
	Budget     *big.Int
	Period     uint32
	Skills     *big.Int
	Timestamp  uint32
	Disabled   bool
}, error) {
	var out []interface{}
	err := _DeTask.contract.Call(opts, &out, "getTaskInfo", taskId)

	outstruct := new(struct {
		Title      string
		Desc       string
		Attachment string
		Currency   uint8
		Budget     *big.Int
		Period     uint32
		Skills     *big.Int
		Timestamp  uint32
		Disabled   bool
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.Title = *abi.ConvertType(out[0], new(string)).(*string)
	outstruct.Desc = *abi.ConvertType(out[1], new(string)).(*string)
	outstruct.Attachment = *abi.ConvertType(out[2], new(string)).(*string)
	outstruct.Currency = *abi.ConvertType(out[3], new(uint8)).(*uint8)
	outstruct.Budget = *abi.ConvertType(out[4], new(*big.Int)).(**big.Int)
	outstruct.Period = *abi.ConvertType(out[5], new(uint32)).(*uint32)
	outstruct.Skills = *abi.ConvertType(out[6], new(*big.Int)).(**big.Int)
	outstruct.Timestamp = *abi.ConvertType(out[7], new(uint32)).(*uint32)
	outstruct.Disabled = *abi.ConvertType(out[8], new(bool)).(*bool)

	return *outstruct, err

}

// GetTaskInfo is a free data retrieval call binding the contract method 0xd1a1b999.
//
// Solidity: function getTaskInfo(uint256 taskId) view returns(string title, string desc, string attachment, uint8 currency, uint128 budget, uint32 period, uint48 skills, uint32 timestamp, bool disabled)
func (_DeTask *DeTaskSession) GetTaskInfo(taskId *big.Int) (struct {
	Title      string
	Desc       string
	Attachment string
	Currency   uint8
	Budget     *big.Int
	Period     uint32
	Skills     *big.Int
	Timestamp  uint32
	Disabled   bool
}, error) {
	return _DeTask.Contract.GetTaskInfo(&_DeTask.CallOpts, taskId)
}

// GetTaskInfo is a free data retrieval call binding the contract method 0xd1a1b999.
//
// Solidity: function getTaskInfo(uint256 taskId) view returns(string title, string desc, string attachment, uint8 currency, uint128 budget, uint32 period, uint48 skills, uint32 timestamp, bool disabled)
func (_DeTask *DeTaskCallerSession) GetTaskInfo(taskId *big.Int) (struct {
	Title      string
	Desc       string
	Attachment string
	Currency   uint8
	Budget     *big.Int
	Period     uint32
	Skills     *big.Int
	Timestamp  uint32
	Disabled   bool
}, error) {
	return _DeTask.Contract.GetTaskInfo(&_DeTask.CallOpts, taskId)
}

// IsApprovedForAll is a free data retrieval call binding the contract method 0xe985e9c5.
//
// Solidity: function isApprovedForAll(address , address ) view returns(bool)
func (_DeTask *DeTaskCaller) IsApprovedForAll(opts *bind.CallOpts, arg0 common.Address, arg1 common.Address) (bool, error) {
	var out []interface{}
	err := _DeTask.contract.Call(opts, &out, "isApprovedForAll", arg0, arg1)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsApprovedForAll is a free data retrieval call binding the contract method 0xe985e9c5.
//
// Solidity: function isApprovedForAll(address , address ) view returns(bool)
func (_DeTask *DeTaskSession) IsApprovedForAll(arg0 common.Address, arg1 common.Address) (bool, error) {
	return _DeTask.Contract.IsApprovedForAll(&_DeTask.CallOpts, arg0, arg1)
}

// IsApprovedForAll is a free data retrieval call binding the contract method 0xe985e9c5.
//
// Solidity: function isApprovedForAll(address , address ) view returns(bool)
func (_DeTask *DeTaskCallerSession) IsApprovedForAll(arg0 common.Address, arg1 common.Address) (bool, error) {
	return _DeTask.Contract.IsApprovedForAll(&_DeTask.CallOpts, arg0, arg1)
}

// Locked is a free data retrieval call binding the contract method 0xb45a3c0e.
//
// Solidity: function locked(uint256 tokenId) view returns(bool)
func (_DeTask *DeTaskCaller) Locked(opts *bind.CallOpts, tokenId *big.Int) (bool, error) {
	var out []interface{}
	err := _DeTask.contract.Call(opts, &out, "locked", tokenId)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// Locked is a free data retrieval call binding the contract method 0xb45a3c0e.
//
// Solidity: function locked(uint256 tokenId) view returns(bool)
func (_DeTask *DeTaskSession) Locked(tokenId *big.Int) (bool, error) {
	return _DeTask.Contract.Locked(&_DeTask.CallOpts, tokenId)
}

// Locked is a free data retrieval call binding the contract method 0xb45a3c0e.
//
// Solidity: function locked(uint256 tokenId) view returns(bool)
func (_DeTask *DeTaskCallerSession) Locked(tokenId *big.Int) (bool, error) {
	return _DeTask.Contract.Locked(&_DeTask.CallOpts, tokenId)
}

// MetadataAddr is a free data retrieval call binding the contract method 0x1275e26b.
//
// Solidity: function metadataAddr() view returns(address)
func (_DeTask *DeTaskCaller) MetadataAddr(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _DeTask.contract.Call(opts, &out, "metadataAddr")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// MetadataAddr is a free data retrieval call binding the contract method 0x1275e26b.
//
// Solidity: function metadataAddr() view returns(address)
func (_DeTask *DeTaskSession) MetadataAddr() (common.Address, error) {
	return _DeTask.Contract.MetadataAddr(&_DeTask.CallOpts)
}

// MetadataAddr is a free data retrieval call binding the contract method 0x1275e26b.
//
// Solidity: function metadataAddr() view returns(address)
func (_DeTask *DeTaskCallerSession) MetadataAddr() (common.Address, error) {
	return _DeTask.Contract.MetadataAddr(&_DeTask.CallOpts)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_DeTask *DeTaskCaller) Name(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _DeTask.contract.Call(opts, &out, "name")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_DeTask *DeTaskSession) Name() (string, error) {
	return _DeTask.Contract.Name(&_DeTask.CallOpts)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_DeTask *DeTaskCallerSession) Name() (string, error) {
	return _DeTask.Contract.Name(&_DeTask.CallOpts)
}

// Order is a free data retrieval call binding the contract method 0xbf15071d.
//
// Solidity: function order() view returns(address)
func (_DeTask *DeTaskCaller) Order(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _DeTask.contract.Call(opts, &out, "order")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Order is a free data retrieval call binding the contract method 0xbf15071d.
//
// Solidity: function order() view returns(address)
func (_DeTask *DeTaskSession) Order() (common.Address, error) {
	return _DeTask.Contract.Order(&_DeTask.CallOpts)
}

// Order is a free data retrieval call binding the contract method 0xbf15071d.
//
// Solidity: function order() view returns(address)
func (_DeTask *DeTaskCallerSession) Order() (common.Address, error) {
	return _DeTask.Contract.Order(&_DeTask.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_DeTask *DeTaskCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _DeTask.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_DeTask *DeTaskSession) Owner() (common.Address, error) {
	return _DeTask.Contract.Owner(&_DeTask.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_DeTask *DeTaskCallerSession) Owner() (common.Address, error) {
	return _DeTask.Contract.Owner(&_DeTask.CallOpts)
}

// OwnerOf is a free data retrieval call binding the contract method 0x6352211e.
//
// Solidity: function ownerOf(uint256 tokenId) view returns(address)
func (_DeTask *DeTaskCaller) OwnerOf(opts *bind.CallOpts, tokenId *big.Int) (common.Address, error) {
	var out []interface{}
	err := _DeTask.contract.Call(opts, &out, "ownerOf", tokenId)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// OwnerOf is a free data retrieval call binding the contract method 0x6352211e.
//
// Solidity: function ownerOf(uint256 tokenId) view returns(address)
func (_DeTask *DeTaskSession) OwnerOf(tokenId *big.Int) (common.Address, error) {
	return _DeTask.Contract.OwnerOf(&_DeTask.CallOpts, tokenId)
}

// OwnerOf is a free data retrieval call binding the contract method 0x6352211e.
//
// Solidity: function ownerOf(uint256 tokenId) view returns(address)
func (_DeTask *DeTaskCallerSession) OwnerOf(tokenId *big.Int) (common.Address, error) {
	return _DeTask.Contract.OwnerOf(&_DeTask.CallOpts, tokenId)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_DeTask *DeTaskCaller) SupportsInterface(opts *bind.CallOpts, interfaceId [4]byte) (bool, error) {
	var out []interface{}
	err := _DeTask.contract.Call(opts, &out, "supportsInterface", interfaceId)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_DeTask *DeTaskSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _DeTask.Contract.SupportsInterface(&_DeTask.CallOpts, interfaceId)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_DeTask *DeTaskCallerSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _DeTask.Contract.SupportsInterface(&_DeTask.CallOpts, interfaceId)
}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_DeTask *DeTaskCaller) Symbol(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _DeTask.contract.Call(opts, &out, "symbol")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_DeTask *DeTaskSession) Symbol() (string, error) {
	return _DeTask.Contract.Symbol(&_DeTask.CallOpts)
}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_DeTask *DeTaskCallerSession) Symbol() (string, error) {
	return _DeTask.Contract.Symbol(&_DeTask.CallOpts)
}

// Tasks is a free data retrieval call binding the contract method 0x8d977672.
//
// Solidity: function tasks(uint256 ) view returns(string title, string desc, string attachment, uint8 currency, uint128 budget, uint32 period, uint48 skills, uint32 timestamp, bool disabled)
func (_DeTask *DeTaskCaller) Tasks(opts *bind.CallOpts, arg0 *big.Int) (struct {
	Title      string
	Desc       string
	Attachment string
	Currency   uint8
	Budget     *big.Int
	Period     uint32
	Skills     *big.Int
	Timestamp  uint32
	Disabled   bool
}, error) {
	var out []interface{}
	err := _DeTask.contract.Call(opts, &out, "tasks", arg0)

	outstruct := new(struct {
		Title      string
		Desc       string
		Attachment string
		Currency   uint8
		Budget     *big.Int
		Period     uint32
		Skills     *big.Int
		Timestamp  uint32
		Disabled   bool
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.Title = *abi.ConvertType(out[0], new(string)).(*string)
	outstruct.Desc = *abi.ConvertType(out[1], new(string)).(*string)
	outstruct.Attachment = *abi.ConvertType(out[2], new(string)).(*string)
	outstruct.Currency = *abi.ConvertType(out[3], new(uint8)).(*uint8)
	outstruct.Budget = *abi.ConvertType(out[4], new(*big.Int)).(**big.Int)
	outstruct.Period = *abi.ConvertType(out[5], new(uint32)).(*uint32)
	outstruct.Skills = *abi.ConvertType(out[6], new(*big.Int)).(**big.Int)
	outstruct.Timestamp = *abi.ConvertType(out[7], new(uint32)).(*uint32)
	outstruct.Disabled = *abi.ConvertType(out[8], new(bool)).(*bool)

	return *outstruct, err

}

// Tasks is a free data retrieval call binding the contract method 0x8d977672.
//
// Solidity: function tasks(uint256 ) view returns(string title, string desc, string attachment, uint8 currency, uint128 budget, uint32 period, uint48 skills, uint32 timestamp, bool disabled)
func (_DeTask *DeTaskSession) Tasks(arg0 *big.Int) (struct {
	Title      string
	Desc       string
	Attachment string
	Currency   uint8
	Budget     *big.Int
	Period     uint32
	Skills     *big.Int
	Timestamp  uint32
	Disabled   bool
}, error) {
	return _DeTask.Contract.Tasks(&_DeTask.CallOpts, arg0)
}

// Tasks is a free data retrieval call binding the contract method 0x8d977672.
//
// Solidity: function tasks(uint256 ) view returns(string title, string desc, string attachment, uint8 currency, uint128 budget, uint32 period, uint48 skills, uint32 timestamp, bool disabled)
func (_DeTask *DeTaskCallerSession) Tasks(arg0 *big.Int) (struct {
	Title      string
	Desc       string
	Attachment string
	Currency   uint8
	Budget     *big.Int
	Period     uint32
	Skills     *big.Int
	Timestamp  uint32
	Disabled   bool
}, error) {
	return _DeTask.Contract.Tasks(&_DeTask.CallOpts, arg0)
}

// TokenURI is a free data retrieval call binding the contract method 0xc87b56dd.
//
// Solidity: function tokenURI(uint256 tokenId) view returns(string)
func (_DeTask *DeTaskCaller) TokenURI(opts *bind.CallOpts, tokenId *big.Int) (string, error) {
	var out []interface{}
	err := _DeTask.contract.Call(opts, &out, "tokenURI", tokenId)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// TokenURI is a free data retrieval call binding the contract method 0xc87b56dd.
//
// Solidity: function tokenURI(uint256 tokenId) view returns(string)
func (_DeTask *DeTaskSession) TokenURI(tokenId *big.Int) (string, error) {
	return _DeTask.Contract.TokenURI(&_DeTask.CallOpts, tokenId)
}

// TokenURI is a free data retrieval call binding the contract method 0xc87b56dd.
//
// Solidity: function tokenURI(uint256 tokenId) view returns(string)
func (_DeTask *DeTaskCallerSession) TokenURI(tokenId *big.Int) (string, error) {
	return _DeTask.Contract.TokenURI(&_DeTask.CallOpts, tokenId)
}

// ApplyAndCancel is a paid mutator transaction binding the contract method 0x6a926691.
//
// Solidity: function applyAndCancel(address who, uint256[] _taskIds, uint256[] costs, uint256[] cancelIds) payable returns()
func (_DeTask *DeTaskTransactor) ApplyAndCancel(opts *bind.TransactOpts, who common.Address, _taskIds []*big.Int, costs []*big.Int, cancelIds []*big.Int) (*types.Transaction, error) {
	return _DeTask.contract.Transact(opts, "applyAndCancel", who, _taskIds, costs, cancelIds)
}

// ApplyAndCancel is a paid mutator transaction binding the contract method 0x6a926691.
//
// Solidity: function applyAndCancel(address who, uint256[] _taskIds, uint256[] costs, uint256[] cancelIds) payable returns()
func (_DeTask *DeTaskSession) ApplyAndCancel(who common.Address, _taskIds []*big.Int, costs []*big.Int, cancelIds []*big.Int) (*types.Transaction, error) {
	return _DeTask.Contract.ApplyAndCancel(&_DeTask.TransactOpts, who, _taskIds, costs, cancelIds)
}

// ApplyAndCancel is a paid mutator transaction binding the contract method 0x6a926691.
//
// Solidity: function applyAndCancel(address who, uint256[] _taskIds, uint256[] costs, uint256[] cancelIds) payable returns()
func (_DeTask *DeTaskTransactorSession) ApplyAndCancel(who common.Address, _taskIds []*big.Int, costs []*big.Int, cancelIds []*big.Int) (*types.Transaction, error) {
	return _DeTask.Contract.ApplyAndCancel(&_DeTask.TransactOpts, who, _taskIds, costs, cancelIds)
}

// ApplyFor is a paid mutator transaction binding the contract method 0x76a41a02.
//
// Solidity: function applyFor(address who, uint256 taskId, uint256 _cost) payable returns()
func (_DeTask *DeTaskTransactor) ApplyFor(opts *bind.TransactOpts, who common.Address, taskId *big.Int, _cost *big.Int) (*types.Transaction, error) {
	return _DeTask.contract.Transact(opts, "applyFor", who, taskId, _cost)
}

// ApplyFor is a paid mutator transaction binding the contract method 0x76a41a02.
//
// Solidity: function applyFor(address who, uint256 taskId, uint256 _cost) payable returns()
func (_DeTask *DeTaskSession) ApplyFor(who common.Address, taskId *big.Int, _cost *big.Int) (*types.Transaction, error) {
	return _DeTask.Contract.ApplyFor(&_DeTask.TransactOpts, who, taskId, _cost)
}

// ApplyFor is a paid mutator transaction binding the contract method 0x76a41a02.
//
// Solidity: function applyFor(address who, uint256 taskId, uint256 _cost) payable returns()
func (_DeTask *DeTaskTransactorSession) ApplyFor(who common.Address, taskId *big.Int, _cost *big.Int) (*types.Transaction, error) {
	return _DeTask.Contract.ApplyFor(&_DeTask.TransactOpts, who, taskId, _cost)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address , uint256 ) returns()
func (_DeTask *DeTaskTransactor) Approve(opts *bind.TransactOpts, arg0 common.Address, arg1 *big.Int) (*types.Transaction, error) {
	return _DeTask.contract.Transact(opts, "approve", arg0, arg1)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address , uint256 ) returns()
func (_DeTask *DeTaskSession) Approve(arg0 common.Address, arg1 *big.Int) (*types.Transaction, error) {
	return _DeTask.Contract.Approve(&_DeTask.TransactOpts, arg0, arg1)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address , uint256 ) returns()
func (_DeTask *DeTaskTransactorSession) Approve(arg0 common.Address, arg1 *big.Int) (*types.Transaction, error) {
	return _DeTask.Contract.Approve(&_DeTask.TransactOpts, arg0, arg1)
}

// CancelApply is a paid mutator transaction binding the contract method 0xd4fa6d1f.
//
// Solidity: function cancelApply(uint256 taskId) returns()
func (_DeTask *DeTaskTransactor) CancelApply(opts *bind.TransactOpts, taskId *big.Int) (*types.Transaction, error) {
	return _DeTask.contract.Transact(opts, "cancelApply", taskId)
}

// CancelApply is a paid mutator transaction binding the contract method 0xd4fa6d1f.
//
// Solidity: function cancelApply(uint256 taskId) returns()
func (_DeTask *DeTaskSession) CancelApply(taskId *big.Int) (*types.Transaction, error) {
	return _DeTask.Contract.CancelApply(&_DeTask.TransactOpts, taskId)
}

// CancelApply is a paid mutator transaction binding the contract method 0xd4fa6d1f.
//
// Solidity: function cancelApply(uint256 taskId) returns()
func (_DeTask *DeTaskTransactorSession) CancelApply(taskId *big.Int) (*types.Transaction, error) {
	return _DeTask.Contract.CancelApply(&_DeTask.TransactOpts, taskId)
}

// CreateTask is a paid mutator transaction binding the contract method 0xc9503caf.
//
// Solidity: function createTask(address who, (string,string,string,uint8,uint128,uint32,uint48,uint32,bool) task) payable returns()
func (_DeTask *DeTaskTransactor) CreateTask(opts *bind.TransactOpts, who common.Address, task TaskInfo) (*types.Transaction, error) {
	return _DeTask.contract.Transact(opts, "createTask", who, task)
}

// CreateTask is a paid mutator transaction binding the contract method 0xc9503caf.
//
// Solidity: function createTask(address who, (string,string,string,uint8,uint128,uint32,uint48,uint32,bool) task) payable returns()
func (_DeTask *DeTaskSession) CreateTask(who common.Address, task TaskInfo) (*types.Transaction, error) {
	return _DeTask.Contract.CreateTask(&_DeTask.TransactOpts, who, task)
}

// CreateTask is a paid mutator transaction binding the contract method 0xc9503caf.
//
// Solidity: function createTask(address who, (string,string,string,uint8,uint128,uint32,uint48,uint32,bool) task) payable returns()
func (_DeTask *DeTaskTransactorSession) CreateTask(who common.Address, task TaskInfo) (*types.Transaction, error) {
	return _DeTask.Contract.CreateTask(&_DeTask.TransactOpts, who, task)
}

// DisableTask is a paid mutator transaction binding the contract method 0x80c33004.
//
// Solidity: function disableTask(uint256 taskId, bool _disabled) returns()
func (_DeTask *DeTaskTransactor) DisableTask(opts *bind.TransactOpts, taskId *big.Int, _disabled bool) (*types.Transaction, error) {
	return _DeTask.contract.Transact(opts, "disableTask", taskId, _disabled)
}

// DisableTask is a paid mutator transaction binding the contract method 0x80c33004.
//
// Solidity: function disableTask(uint256 taskId, bool _disabled) returns()
func (_DeTask *DeTaskSession) DisableTask(taskId *big.Int, _disabled bool) (*types.Transaction, error) {
	return _DeTask.Contract.DisableTask(&_DeTask.TransactOpts, taskId, _disabled)
}

// DisableTask is a paid mutator transaction binding the contract method 0x80c33004.
//
// Solidity: function disableTask(uint256 taskId, bool _disabled) returns()
func (_DeTask *DeTaskTransactorSession) DisableTask(taskId *big.Int, _disabled bool) (*types.Transaction, error) {
	return _DeTask.Contract.DisableTask(&_DeTask.TransactOpts, taskId, _disabled)
}

// ModifyTask is a paid mutator transaction binding the contract method 0xc786fdce.
//
// Solidity: function modifyTask(uint256 taskId, (string,string,string,uint8,uint128,uint32,uint48,uint32,bool) task) payable returns()
func (_DeTask *DeTaskTransactor) ModifyTask(opts *bind.TransactOpts, taskId *big.Int, task TaskInfo) (*types.Transaction, error) {
	return _DeTask.contract.Transact(opts, "modifyTask", taskId, task)
}

// ModifyTask is a paid mutator transaction binding the contract method 0xc786fdce.
//
// Solidity: function modifyTask(uint256 taskId, (string,string,string,uint8,uint128,uint32,uint48,uint32,bool) task) payable returns()
func (_DeTask *DeTaskSession) ModifyTask(taskId *big.Int, task TaskInfo) (*types.Transaction, error) {
	return _DeTask.Contract.ModifyTask(&_DeTask.TransactOpts, taskId, task)
}

// ModifyTask is a paid mutator transaction binding the contract method 0xc786fdce.
//
// Solidity: function modifyTask(uint256 taskId, (string,string,string,uint8,uint128,uint32,uint48,uint32,bool) task) payable returns()
func (_DeTask *DeTaskTransactorSession) ModifyTask(taskId *big.Int, task TaskInfo) (*types.Transaction, error) {
	return _DeTask.Contract.ModifyTask(&_DeTask.TransactOpts, taskId, task)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_DeTask *DeTaskTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _DeTask.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_DeTask *DeTaskSession) RenounceOwnership() (*types.Transaction, error) {
	return _DeTask.Contract.RenounceOwnership(&_DeTask.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_DeTask *DeTaskTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _DeTask.Contract.RenounceOwnership(&_DeTask.TransactOpts)
}

// SafeTransferFrom is a paid mutator transaction binding the contract method 0x42842e0e.
//
// Solidity: function safeTransferFrom(address , address , uint256 ) returns()
func (_DeTask *DeTaskTransactor) SafeTransferFrom(opts *bind.TransactOpts, arg0 common.Address, arg1 common.Address, arg2 *big.Int) (*types.Transaction, error) {
	return _DeTask.contract.Transact(opts, "safeTransferFrom", arg0, arg1, arg2)
}

// SafeTransferFrom is a paid mutator transaction binding the contract method 0x42842e0e.
//
// Solidity: function safeTransferFrom(address , address , uint256 ) returns()
func (_DeTask *DeTaskSession) SafeTransferFrom(arg0 common.Address, arg1 common.Address, arg2 *big.Int) (*types.Transaction, error) {
	return _DeTask.Contract.SafeTransferFrom(&_DeTask.TransactOpts, arg0, arg1, arg2)
}

// SafeTransferFrom is a paid mutator transaction binding the contract method 0x42842e0e.
//
// Solidity: function safeTransferFrom(address , address , uint256 ) returns()
func (_DeTask *DeTaskTransactorSession) SafeTransferFrom(arg0 common.Address, arg1 common.Address, arg2 *big.Int) (*types.Transaction, error) {
	return _DeTask.Contract.SafeTransferFrom(&_DeTask.TransactOpts, arg0, arg1, arg2)
}

// SafeTransferFrom0 is a paid mutator transaction binding the contract method 0xb88d4fde.
//
// Solidity: function safeTransferFrom(address , address , uint256 , bytes ) returns()
func (_DeTask *DeTaskTransactor) SafeTransferFrom0(opts *bind.TransactOpts, arg0 common.Address, arg1 common.Address, arg2 *big.Int, arg3 []byte) (*types.Transaction, error) {
	return _DeTask.contract.Transact(opts, "safeTransferFrom0", arg0, arg1, arg2, arg3)
}

// SafeTransferFrom0 is a paid mutator transaction binding the contract method 0xb88d4fde.
//
// Solidity: function safeTransferFrom(address , address , uint256 , bytes ) returns()
func (_DeTask *DeTaskSession) SafeTransferFrom0(arg0 common.Address, arg1 common.Address, arg2 *big.Int, arg3 []byte) (*types.Transaction, error) {
	return _DeTask.Contract.SafeTransferFrom0(&_DeTask.TransactOpts, arg0, arg1, arg2, arg3)
}

// SafeTransferFrom0 is a paid mutator transaction binding the contract method 0xb88d4fde.
//
// Solidity: function safeTransferFrom(address , address , uint256 , bytes ) returns()
func (_DeTask *DeTaskTransactorSession) SafeTransferFrom0(arg0 common.Address, arg1 common.Address, arg2 *big.Int, arg3 []byte) (*types.Transaction, error) {
	return _DeTask.Contract.SafeTransferFrom0(&_DeTask.TransactOpts, arg0, arg1, arg2, arg3)
}

// SetApprovalForAll is a paid mutator transaction binding the contract method 0xa22cb465.
//
// Solidity: function setApprovalForAll(address , bool ) returns()
func (_DeTask *DeTaskTransactor) SetApprovalForAll(opts *bind.TransactOpts, arg0 common.Address, arg1 bool) (*types.Transaction, error) {
	return _DeTask.contract.Transact(opts, "setApprovalForAll", arg0, arg1)
}

// SetApprovalForAll is a paid mutator transaction binding the contract method 0xa22cb465.
//
// Solidity: function setApprovalForAll(address , bool ) returns()
func (_DeTask *DeTaskSession) SetApprovalForAll(arg0 common.Address, arg1 bool) (*types.Transaction, error) {
	return _DeTask.Contract.SetApprovalForAll(&_DeTask.TransactOpts, arg0, arg1)
}

// SetApprovalForAll is a paid mutator transaction binding the contract method 0xa22cb465.
//
// Solidity: function setApprovalForAll(address , bool ) returns()
func (_DeTask *DeTaskTransactorSession) SetApprovalForAll(arg0 common.Address, arg1 bool) (*types.Transaction, error) {
	return _DeTask.Contract.SetApprovalForAll(&_DeTask.TransactOpts, arg0, arg1)
}

// SetMetadataContract is a paid mutator transaction binding the contract method 0xe5187f43.
//
// Solidity: function setMetadataContract(address _meta) returns()
func (_DeTask *DeTaskTransactor) SetMetadataContract(opts *bind.TransactOpts, _meta common.Address) (*types.Transaction, error) {
	return _DeTask.contract.Transact(opts, "setMetadataContract", _meta)
}

// SetMetadataContract is a paid mutator transaction binding the contract method 0xe5187f43.
//
// Solidity: function setMetadataContract(address _meta) returns()
func (_DeTask *DeTaskSession) SetMetadataContract(_meta common.Address) (*types.Transaction, error) {
	return _DeTask.Contract.SetMetadataContract(&_DeTask.TransactOpts, _meta)
}

// SetMetadataContract is a paid mutator transaction binding the contract method 0xe5187f43.
//
// Solidity: function setMetadataContract(address _meta) returns()
func (_DeTask *DeTaskTransactorSession) SetMetadataContract(_meta common.Address) (*types.Transaction, error) {
	return _DeTask.Contract.SetMetadataContract(&_DeTask.TransactOpts, _meta)
}

// SetOrder is a paid mutator transaction binding the contract method 0x0e5b34be.
//
// Solidity: function setOrder(address _order) returns()
func (_DeTask *DeTaskTransactor) SetOrder(opts *bind.TransactOpts, _order common.Address) (*types.Transaction, error) {
	return _DeTask.contract.Transact(opts, "setOrder", _order)
}

// SetOrder is a paid mutator transaction binding the contract method 0x0e5b34be.
//
// Solidity: function setOrder(address _order) returns()
func (_DeTask *DeTaskSession) SetOrder(_order common.Address) (*types.Transaction, error) {
	return _DeTask.Contract.SetOrder(&_DeTask.TransactOpts, _order)
}

// SetOrder is a paid mutator transaction binding the contract method 0x0e5b34be.
//
// Solidity: function setOrder(address _order) returns()
func (_DeTask *DeTaskTransactorSession) SetOrder(_order common.Address) (*types.Transaction, error) {
	return _DeTask.Contract.SetOrder(&_DeTask.TransactOpts, _order)
}

// TransferFee is a paid mutator transaction binding the contract method 0xd4203561.
//
// Solidity: function transferFee(uint256 amount) returns()
func (_DeTask *DeTaskTransactor) TransferFee(opts *bind.TransactOpts, amount *big.Int) (*types.Transaction, error) {
	return _DeTask.contract.Transact(opts, "transferFee", amount)
}

// TransferFee is a paid mutator transaction binding the contract method 0xd4203561.
//
// Solidity: function transferFee(uint256 amount) returns()
func (_DeTask *DeTaskSession) TransferFee(amount *big.Int) (*types.Transaction, error) {
	return _DeTask.Contract.TransferFee(&_DeTask.TransactOpts, amount)
}

// TransferFee is a paid mutator transaction binding the contract method 0xd4203561.
//
// Solidity: function transferFee(uint256 amount) returns()
func (_DeTask *DeTaskTransactorSession) TransferFee(amount *big.Int) (*types.Transaction, error) {
	return _DeTask.Contract.TransferFee(&_DeTask.TransactOpts, amount)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address , address , uint256 ) returns()
func (_DeTask *DeTaskTransactor) TransferFrom(opts *bind.TransactOpts, arg0 common.Address, arg1 common.Address, arg2 *big.Int) (*types.Transaction, error) {
	return _DeTask.contract.Transact(opts, "transferFrom", arg0, arg1, arg2)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address , address , uint256 ) returns()
func (_DeTask *DeTaskSession) TransferFrom(arg0 common.Address, arg1 common.Address, arg2 *big.Int) (*types.Transaction, error) {
	return _DeTask.Contract.TransferFrom(&_DeTask.TransactOpts, arg0, arg1, arg2)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address , address , uint256 ) returns()
func (_DeTask *DeTaskTransactorSession) TransferFrom(arg0 common.Address, arg1 common.Address, arg2 *big.Int) (*types.Transaction, error) {
	return _DeTask.Contract.TransferFrom(&_DeTask.TransactOpts, arg0, arg1, arg2)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_DeTask *DeTaskTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _DeTask.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_DeTask *DeTaskSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _DeTask.Contract.TransferOwnership(&_DeTask.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_DeTask *DeTaskTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _DeTask.Contract.TransferOwnership(&_DeTask.TransactOpts, newOwner)
}

// UpdateFeeReceiver is a paid mutator transaction binding the contract method 0x90c2c656.
//
// Solidity: function updateFeeReceiver(uint256 _taskFee, uint256 _applyFee, address _receiver) returns()
func (_DeTask *DeTaskTransactor) UpdateFeeReceiver(opts *bind.TransactOpts, _taskFee *big.Int, _applyFee *big.Int, _receiver common.Address) (*types.Transaction, error) {
	return _DeTask.contract.Transact(opts, "updateFeeReceiver", _taskFee, _applyFee, _receiver)
}

// UpdateFeeReceiver is a paid mutator transaction binding the contract method 0x90c2c656.
//
// Solidity: function updateFeeReceiver(uint256 _taskFee, uint256 _applyFee, address _receiver) returns()
func (_DeTask *DeTaskSession) UpdateFeeReceiver(_taskFee *big.Int, _applyFee *big.Int, _receiver common.Address) (*types.Transaction, error) {
	return _DeTask.Contract.UpdateFeeReceiver(&_DeTask.TransactOpts, _taskFee, _applyFee, _receiver)
}

// UpdateFeeReceiver is a paid mutator transaction binding the contract method 0x90c2c656.
//
// Solidity: function updateFeeReceiver(uint256 _taskFee, uint256 _applyFee, address _receiver) returns()
func (_DeTask *DeTaskTransactorSession) UpdateFeeReceiver(_taskFee *big.Int, _applyFee *big.Int, _receiver common.Address) (*types.Transaction, error) {
	return _DeTask.Contract.UpdateFeeReceiver(&_DeTask.TransactOpts, _taskFee, _applyFee, _receiver)
}

// DeTaskApplyForIterator is returned from FilterApplyFor and is used to iterate over the raw logs and unpacked data for ApplyFor events raised by the DeTask contract.
type DeTaskApplyForIterator struct {
	Event *DeTaskApplyFor // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *DeTaskApplyForIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeTaskApplyFor)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(DeTaskApplyFor)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *DeTaskApplyForIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeTaskApplyForIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeTaskApplyFor represents a ApplyFor event raised by the DeTask contract.
type DeTaskApplyFor struct {
	TaskId *big.Int
	Worker common.Address
	Cost   *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterApplyFor is a free log retrieval operation binding the contract event 0x4c9756716032f5f6730d78679ef0dd08e2b329301f77880e23fa8cab0a150657.
//
// Solidity: event ApplyFor(uint256 indexed taskId, address indexed worker, uint256 cost)
func (_DeTask *DeTaskFilterer) FilterApplyFor(opts *bind.FilterOpts, taskId []*big.Int, worker []common.Address) (*DeTaskApplyForIterator, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}
	var workerRule []interface{}
	for _, workerItem := range worker {
		workerRule = append(workerRule, workerItem)
	}

	logs, sub, err := _DeTask.contract.FilterLogs(opts, "ApplyFor", taskIdRule, workerRule)
	if err != nil {
		return nil, err
	}
	return &DeTaskApplyForIterator{contract: _DeTask.contract, event: "ApplyFor", logs: logs, sub: sub}, nil
}

// WatchApplyFor is a free log subscription operation binding the contract event 0x4c9756716032f5f6730d78679ef0dd08e2b329301f77880e23fa8cab0a150657.
//
// Solidity: event ApplyFor(uint256 indexed taskId, address indexed worker, uint256 cost)
func (_DeTask *DeTaskFilterer) WatchApplyFor(opts *bind.WatchOpts, sink chan<- *DeTaskApplyFor, taskId []*big.Int, worker []common.Address) (event.Subscription, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}
	var workerRule []interface{}
	for _, workerItem := range worker {
		workerRule = append(workerRule, workerItem)
	}

	logs, sub, err := _DeTask.contract.WatchLogs(opts, "ApplyFor", taskIdRule, workerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeTaskApplyFor)
				if err := _DeTask.contract.UnpackLog(event, "ApplyFor", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseApplyFor is a log parse operation binding the contract event 0x4c9756716032f5f6730d78679ef0dd08e2b329301f77880e23fa8cab0a150657.
//
// Solidity: event ApplyFor(uint256 indexed taskId, address indexed worker, uint256 cost)
func (_DeTask *DeTaskFilterer) ParseApplyFor(log types.Log) (*DeTaskApplyFor, error) {
	event := new(DeTaskApplyFor)
	if err := _DeTask.contract.UnpackLog(event, "ApplyFor", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DeTaskApprovalIterator is returned from FilterApproval and is used to iterate over the raw logs and unpacked data for Approval events raised by the DeTask contract.
type DeTaskApprovalIterator struct {
	Event *DeTaskApproval // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *DeTaskApprovalIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeTaskApproval)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(DeTaskApproval)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *DeTaskApprovalIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeTaskApprovalIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeTaskApproval represents a Approval event raised by the DeTask contract.
type DeTaskApproval struct {
	Owner    common.Address
	Approved common.Address
	TokenId  *big.Int
	Raw      types.Log // Blockchain specific contextual infos
}

// FilterApproval is a free log retrieval operation binding the contract event 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925.
//
// Solidity: event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)
func (_DeTask *DeTaskFilterer) FilterApproval(opts *bind.FilterOpts, owner []common.Address, approved []common.Address, tokenId []*big.Int) (*DeTaskApprovalIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var approvedRule []interface{}
	for _, approvedItem := range approved {
		approvedRule = append(approvedRule, approvedItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _DeTask.contract.FilterLogs(opts, "Approval", ownerRule, approvedRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &DeTaskApprovalIterator{contract: _DeTask.contract, event: "Approval", logs: logs, sub: sub}, nil
}

// WatchApproval is a free log subscription operation binding the contract event 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925.
//
// Solidity: event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)
func (_DeTask *DeTaskFilterer) WatchApproval(opts *bind.WatchOpts, sink chan<- *DeTaskApproval, owner []common.Address, approved []common.Address, tokenId []*big.Int) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var approvedRule []interface{}
	for _, approvedItem := range approved {
		approvedRule = append(approvedRule, approvedItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _DeTask.contract.WatchLogs(opts, "Approval", ownerRule, approvedRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeTaskApproval)
				if err := _DeTask.contract.UnpackLog(event, "Approval", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseApproval is a log parse operation binding the contract event 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925.
//
// Solidity: event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)
func (_DeTask *DeTaskFilterer) ParseApproval(log types.Log) (*DeTaskApproval, error) {
	event := new(DeTaskApproval)
	if err := _DeTask.contract.UnpackLog(event, "Approval", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DeTaskApprovalForAllIterator is returned from FilterApprovalForAll and is used to iterate over the raw logs and unpacked data for ApprovalForAll events raised by the DeTask contract.
type DeTaskApprovalForAllIterator struct {
	Event *DeTaskApprovalForAll // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *DeTaskApprovalForAllIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeTaskApprovalForAll)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(DeTaskApprovalForAll)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *DeTaskApprovalForAllIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeTaskApprovalForAllIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeTaskApprovalForAll represents a ApprovalForAll event raised by the DeTask contract.
type DeTaskApprovalForAll struct {
	Owner    common.Address
	Operator common.Address
	Approved bool
	Raw      types.Log // Blockchain specific contextual infos
}

// FilterApprovalForAll is a free log retrieval operation binding the contract event 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31.
//
// Solidity: event ApprovalForAll(address indexed owner, address indexed operator, bool approved)
func (_DeTask *DeTaskFilterer) FilterApprovalForAll(opts *bind.FilterOpts, owner []common.Address, operator []common.Address) (*DeTaskApprovalForAllIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}

	logs, sub, err := _DeTask.contract.FilterLogs(opts, "ApprovalForAll", ownerRule, operatorRule)
	if err != nil {
		return nil, err
	}
	return &DeTaskApprovalForAllIterator{contract: _DeTask.contract, event: "ApprovalForAll", logs: logs, sub: sub}, nil
}

// WatchApprovalForAll is a free log subscription operation binding the contract event 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31.
//
// Solidity: event ApprovalForAll(address indexed owner, address indexed operator, bool approved)
func (_DeTask *DeTaskFilterer) WatchApprovalForAll(opts *bind.WatchOpts, sink chan<- *DeTaskApprovalForAll, owner []common.Address, operator []common.Address) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}

	logs, sub, err := _DeTask.contract.WatchLogs(opts, "ApprovalForAll", ownerRule, operatorRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeTaskApprovalForAll)
				if err := _DeTask.contract.UnpackLog(event, "ApprovalForAll", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseApprovalForAll is a log parse operation binding the contract event 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31.
//
// Solidity: event ApprovalForAll(address indexed owner, address indexed operator, bool approved)
func (_DeTask *DeTaskFilterer) ParseApprovalForAll(log types.Log) (*DeTaskApprovalForAll, error) {
	event := new(DeTaskApprovalForAll)
	if err := _DeTask.contract.UnpackLog(event, "ApprovalForAll", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DeTaskCancelApplyIterator is returned from FilterCancelApply and is used to iterate over the raw logs and unpacked data for CancelApply events raised by the DeTask contract.
type DeTaskCancelApplyIterator struct {
	Event *DeTaskCancelApply // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *DeTaskCancelApplyIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeTaskCancelApply)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(DeTaskCancelApply)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *DeTaskCancelApplyIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeTaskCancelApplyIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeTaskCancelApply represents a CancelApply event raised by the DeTask contract.
type DeTaskCancelApply struct {
	TaskId *big.Int
	Worker common.Address
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterCancelApply is a free log retrieval operation binding the contract event 0x32fb6e8d2f978f5b7e04d03ad7b3605ca4f45d67d9979bfc34aba61809bee139.
//
// Solidity: event CancelApply(uint256 indexed taskId, address worker)
func (_DeTask *DeTaskFilterer) FilterCancelApply(opts *bind.FilterOpts, taskId []*big.Int) (*DeTaskCancelApplyIterator, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _DeTask.contract.FilterLogs(opts, "CancelApply", taskIdRule)
	if err != nil {
		return nil, err
	}
	return &DeTaskCancelApplyIterator{contract: _DeTask.contract, event: "CancelApply", logs: logs, sub: sub}, nil
}

// WatchCancelApply is a free log subscription operation binding the contract event 0x32fb6e8d2f978f5b7e04d03ad7b3605ca4f45d67d9979bfc34aba61809bee139.
//
// Solidity: event CancelApply(uint256 indexed taskId, address worker)
func (_DeTask *DeTaskFilterer) WatchCancelApply(opts *bind.WatchOpts, sink chan<- *DeTaskCancelApply, taskId []*big.Int) (event.Subscription, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _DeTask.contract.WatchLogs(opts, "CancelApply", taskIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeTaskCancelApply)
				if err := _DeTask.contract.UnpackLog(event, "CancelApply", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseCancelApply is a log parse operation binding the contract event 0x32fb6e8d2f978f5b7e04d03ad7b3605ca4f45d67d9979bfc34aba61809bee139.
//
// Solidity: event CancelApply(uint256 indexed taskId, address worker)
func (_DeTask *DeTaskFilterer) ParseCancelApply(log types.Log) (*DeTaskCancelApply, error) {
	event := new(DeTaskCancelApply)
	if err := _DeTask.contract.UnpackLog(event, "CancelApply", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DeTaskLockedIterator is returned from FilterLocked and is used to iterate over the raw logs and unpacked data for Locked events raised by the DeTask contract.
type DeTaskLockedIterator struct {
	Event *DeTaskLocked // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *DeTaskLockedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeTaskLocked)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(DeTaskLocked)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *DeTaskLockedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeTaskLockedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeTaskLocked represents a Locked event raised by the DeTask contract.
type DeTaskLocked struct {
	TokenId *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterLocked is a free log retrieval operation binding the contract event 0x032bc66be43dbccb7487781d168eb7bda224628a3b2c3388bdf69b532a3a1611.
//
// Solidity: event Locked(uint256 tokenId)
func (_DeTask *DeTaskFilterer) FilterLocked(opts *bind.FilterOpts) (*DeTaskLockedIterator, error) {

	logs, sub, err := _DeTask.contract.FilterLogs(opts, "Locked")
	if err != nil {
		return nil, err
	}
	return &DeTaskLockedIterator{contract: _DeTask.contract, event: "Locked", logs: logs, sub: sub}, nil
}

// WatchLocked is a free log subscription operation binding the contract event 0x032bc66be43dbccb7487781d168eb7bda224628a3b2c3388bdf69b532a3a1611.
//
// Solidity: event Locked(uint256 tokenId)
func (_DeTask *DeTaskFilterer) WatchLocked(opts *bind.WatchOpts, sink chan<- *DeTaskLocked) (event.Subscription, error) {

	logs, sub, err := _DeTask.contract.WatchLogs(opts, "Locked")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeTaskLocked)
				if err := _DeTask.contract.UnpackLog(event, "Locked", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseLocked is a log parse operation binding the contract event 0x032bc66be43dbccb7487781d168eb7bda224628a3b2c3388bdf69b532a3a1611.
//
// Solidity: event Locked(uint256 tokenId)
func (_DeTask *DeTaskFilterer) ParseLocked(log types.Log) (*DeTaskLocked, error) {
	event := new(DeTaskLocked)
	if err := _DeTask.contract.UnpackLog(event, "Locked", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DeTaskModifyFeeIterator is returned from FilterModifyFee and is used to iterate over the raw logs and unpacked data for ModifyFee events raised by the DeTask contract.
type DeTaskModifyFeeIterator struct {
	Event *DeTaskModifyFee // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *DeTaskModifyFeeIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeTaskModifyFee)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(DeTaskModifyFee)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *DeTaskModifyFeeIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeTaskModifyFeeIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeTaskModifyFee represents a ModifyFee event raised by the DeTask contract.
type DeTaskModifyFee struct {
	TaskFee     *big.Int
	ApplyFee    *big.Int
	FeeReceiver common.Address
	Raw         types.Log // Blockchain specific contextual infos
}

// FilterModifyFee is a free log retrieval operation binding the contract event 0x94e1b2663ea089789c2074478048dd52933747a07fe15f1fa6174fee6ee4d72c.
//
// Solidity: event ModifyFee(uint256 taskFee, uint256 applyFee, address feeReceiver)
func (_DeTask *DeTaskFilterer) FilterModifyFee(opts *bind.FilterOpts) (*DeTaskModifyFeeIterator, error) {

	logs, sub, err := _DeTask.contract.FilterLogs(opts, "ModifyFee")
	if err != nil {
		return nil, err
	}
	return &DeTaskModifyFeeIterator{contract: _DeTask.contract, event: "ModifyFee", logs: logs, sub: sub}, nil
}

// WatchModifyFee is a free log subscription operation binding the contract event 0x94e1b2663ea089789c2074478048dd52933747a07fe15f1fa6174fee6ee4d72c.
//
// Solidity: event ModifyFee(uint256 taskFee, uint256 applyFee, address feeReceiver)
func (_DeTask *DeTaskFilterer) WatchModifyFee(opts *bind.WatchOpts, sink chan<- *DeTaskModifyFee) (event.Subscription, error) {

	logs, sub, err := _DeTask.contract.WatchLogs(opts, "ModifyFee")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeTaskModifyFee)
				if err := _DeTask.contract.UnpackLog(event, "ModifyFee", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseModifyFee is a log parse operation binding the contract event 0x94e1b2663ea089789c2074478048dd52933747a07fe15f1fa6174fee6ee4d72c.
//
// Solidity: event ModifyFee(uint256 taskFee, uint256 applyFee, address feeReceiver)
func (_DeTask *DeTaskFilterer) ParseModifyFee(log types.Log) (*DeTaskModifyFee, error) {
	event := new(DeTaskModifyFee)
	if err := _DeTask.contract.UnpackLog(event, "ModifyFee", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DeTaskOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the DeTask contract.
type DeTaskOwnershipTransferredIterator struct {
	Event *DeTaskOwnershipTransferred // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *DeTaskOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeTaskOwnershipTransferred)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(DeTaskOwnershipTransferred)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *DeTaskOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeTaskOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeTaskOwnershipTransferred represents a OwnershipTransferred event raised by the DeTask contract.
type DeTaskOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_DeTask *DeTaskFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*DeTaskOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _DeTask.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &DeTaskOwnershipTransferredIterator{contract: _DeTask.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_DeTask *DeTaskFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *DeTaskOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _DeTask.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeTaskOwnershipTransferred)
				if err := _DeTask.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseOwnershipTransferred is a log parse operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_DeTask *DeTaskFilterer) ParseOwnershipTransferred(log types.Log) (*DeTaskOwnershipTransferred, error) {
	event := new(DeTaskOwnershipTransferred)
	if err := _DeTask.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DeTaskTaskCreatedIterator is returned from FilterTaskCreated and is used to iterate over the raw logs and unpacked data for TaskCreated events raised by the DeTask contract.
type DeTaskTaskCreatedIterator struct {
	Event *DeTaskTaskCreated // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *DeTaskTaskCreatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeTaskTaskCreated)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(DeTaskTaskCreated)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *DeTaskTaskCreatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeTaskTaskCreatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeTaskTaskCreated represents a TaskCreated event raised by the DeTask contract.
type DeTaskTaskCreated struct {
	TaskId *big.Int
	Issuer common.Address
	Task   TaskInfo
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterTaskCreated is a free log retrieval operation binding the contract event 0x2c11cbcbb9eaaf6db76cc5f177c9e3881b23d5f859137d9c1313bbd5c660ac46.
//
// Solidity: event TaskCreated(uint256 indexed taskId, address issuer, (string,string,string,uint8,uint128,uint32,uint48,uint32,bool) task)
func (_DeTask *DeTaskFilterer) FilterTaskCreated(opts *bind.FilterOpts, taskId []*big.Int) (*DeTaskTaskCreatedIterator, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _DeTask.contract.FilterLogs(opts, "TaskCreated", taskIdRule)
	if err != nil {
		return nil, err
	}
	return &DeTaskTaskCreatedIterator{contract: _DeTask.contract, event: "TaskCreated", logs: logs, sub: sub}, nil
}

// WatchTaskCreated is a free log subscription operation binding the contract event 0x2c11cbcbb9eaaf6db76cc5f177c9e3881b23d5f859137d9c1313bbd5c660ac46.
//
// Solidity: event TaskCreated(uint256 indexed taskId, address issuer, (string,string,string,uint8,uint128,uint32,uint48,uint32,bool) task)
func (_DeTask *DeTaskFilterer) WatchTaskCreated(opts *bind.WatchOpts, sink chan<- *DeTaskTaskCreated, taskId []*big.Int) (event.Subscription, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _DeTask.contract.WatchLogs(opts, "TaskCreated", taskIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeTaskTaskCreated)
				if err := _DeTask.contract.UnpackLog(event, "TaskCreated", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTaskCreated is a log parse operation binding the contract event 0x2c11cbcbb9eaaf6db76cc5f177c9e3881b23d5f859137d9c1313bbd5c660ac46.
//
// Solidity: event TaskCreated(uint256 indexed taskId, address issuer, (string,string,string,uint8,uint128,uint32,uint48,uint32,bool) task)
func (_DeTask *DeTaskFilterer) ParseTaskCreated(log types.Log) (*DeTaskTaskCreated, error) {
	event := new(DeTaskTaskCreated)
	if err := _DeTask.contract.UnpackLog(event, "TaskCreated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DeTaskTaskDisabledIterator is returned from FilterTaskDisabled and is used to iterate over the raw logs and unpacked data for TaskDisabled events raised by the DeTask contract.
type DeTaskTaskDisabledIterator struct {
	Event *DeTaskTaskDisabled // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *DeTaskTaskDisabledIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeTaskTaskDisabled)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(DeTaskTaskDisabled)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *DeTaskTaskDisabledIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeTaskTaskDisabledIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeTaskTaskDisabled represents a TaskDisabled event raised by the DeTask contract.
type DeTaskTaskDisabled struct {
	TaskId   *big.Int
	Disabled bool
	Raw      types.Log // Blockchain specific contextual infos
}

// FilterTaskDisabled is a free log retrieval operation binding the contract event 0x10911b1a342c0346ec14d6cfc81d65d293409eca997e8911278e7d94fce45cc9.
//
// Solidity: event TaskDisabled(uint256 indexed taskId, bool disabled)
func (_DeTask *DeTaskFilterer) FilterTaskDisabled(opts *bind.FilterOpts, taskId []*big.Int) (*DeTaskTaskDisabledIterator, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _DeTask.contract.FilterLogs(opts, "TaskDisabled", taskIdRule)
	if err != nil {
		return nil, err
	}
	return &DeTaskTaskDisabledIterator{contract: _DeTask.contract, event: "TaskDisabled", logs: logs, sub: sub}, nil
}

// WatchTaskDisabled is a free log subscription operation binding the contract event 0x10911b1a342c0346ec14d6cfc81d65d293409eca997e8911278e7d94fce45cc9.
//
// Solidity: event TaskDisabled(uint256 indexed taskId, bool disabled)
func (_DeTask *DeTaskFilterer) WatchTaskDisabled(opts *bind.WatchOpts, sink chan<- *DeTaskTaskDisabled, taskId []*big.Int) (event.Subscription, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _DeTask.contract.WatchLogs(opts, "TaskDisabled", taskIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeTaskTaskDisabled)
				if err := _DeTask.contract.UnpackLog(event, "TaskDisabled", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTaskDisabled is a log parse operation binding the contract event 0x10911b1a342c0346ec14d6cfc81d65d293409eca997e8911278e7d94fce45cc9.
//
// Solidity: event TaskDisabled(uint256 indexed taskId, bool disabled)
func (_DeTask *DeTaskFilterer) ParseTaskDisabled(log types.Log) (*DeTaskTaskDisabled, error) {
	event := new(DeTaskTaskDisabled)
	if err := _DeTask.contract.UnpackLog(event, "TaskDisabled", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DeTaskTaskModifiedIterator is returned from FilterTaskModified and is used to iterate over the raw logs and unpacked data for TaskModified events raised by the DeTask contract.
type DeTaskTaskModifiedIterator struct {
	Event *DeTaskTaskModified // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *DeTaskTaskModifiedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeTaskTaskModified)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(DeTaskTaskModified)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *DeTaskTaskModifiedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeTaskTaskModifiedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeTaskTaskModified represents a TaskModified event raised by the DeTask contract.
type DeTaskTaskModified struct {
	TaskId *big.Int
	Issuer common.Address
	Task   TaskInfo
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterTaskModified is a free log retrieval operation binding the contract event 0x66f2c5158b4629f81a53fb503f6436720fce7efc1b4999bb18b2c0460b01530b.
//
// Solidity: event TaskModified(uint256 indexed taskId, address issuer, (string,string,string,uint8,uint128,uint32,uint48,uint32,bool) task)
func (_DeTask *DeTaskFilterer) FilterTaskModified(opts *bind.FilterOpts, taskId []*big.Int) (*DeTaskTaskModifiedIterator, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _DeTask.contract.FilterLogs(opts, "TaskModified", taskIdRule)
	if err != nil {
		return nil, err
	}
	return &DeTaskTaskModifiedIterator{contract: _DeTask.contract, event: "TaskModified", logs: logs, sub: sub}, nil
}

// WatchTaskModified is a free log subscription operation binding the contract event 0x66f2c5158b4629f81a53fb503f6436720fce7efc1b4999bb18b2c0460b01530b.
//
// Solidity: event TaskModified(uint256 indexed taskId, address issuer, (string,string,string,uint8,uint128,uint32,uint48,uint32,bool) task)
func (_DeTask *DeTaskFilterer) WatchTaskModified(opts *bind.WatchOpts, sink chan<- *DeTaskTaskModified, taskId []*big.Int) (event.Subscription, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _DeTask.contract.WatchLogs(opts, "TaskModified", taskIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeTaskTaskModified)
				if err := _DeTask.contract.UnpackLog(event, "TaskModified", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTaskModified is a log parse operation binding the contract event 0x66f2c5158b4629f81a53fb503f6436720fce7efc1b4999bb18b2c0460b01530b.
//
// Solidity: event TaskModified(uint256 indexed taskId, address issuer, (string,string,string,uint8,uint128,uint32,uint48,uint32,bool) task)
func (_DeTask *DeTaskFilterer) ParseTaskModified(log types.Log) (*DeTaskTaskModified, error) {
	event := new(DeTaskTaskModified)
	if err := _DeTask.contract.UnpackLog(event, "TaskModified", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DeTaskTransferIterator is returned from FilterTransfer and is used to iterate over the raw logs and unpacked data for Transfer events raised by the DeTask contract.
type DeTaskTransferIterator struct {
	Event *DeTaskTransfer // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *DeTaskTransferIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeTaskTransfer)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(DeTaskTransfer)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *DeTaskTransferIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeTaskTransferIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeTaskTransfer represents a Transfer event raised by the DeTask contract.
type DeTaskTransfer struct {
	From    common.Address
	To      common.Address
	TokenId *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterTransfer is a free log retrieval operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
func (_DeTask *DeTaskFilterer) FilterTransfer(opts *bind.FilterOpts, from []common.Address, to []common.Address, tokenId []*big.Int) (*DeTaskTransferIterator, error) {

	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _DeTask.contract.FilterLogs(opts, "Transfer", fromRule, toRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &DeTaskTransferIterator{contract: _DeTask.contract, event: "Transfer", logs: logs, sub: sub}, nil
}

// WatchTransfer is a free log subscription operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
func (_DeTask *DeTaskFilterer) WatchTransfer(opts *bind.WatchOpts, sink chan<- *DeTaskTransfer, from []common.Address, to []common.Address, tokenId []*big.Int) (event.Subscription, error) {

	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _DeTask.contract.WatchLogs(opts, "Transfer", fromRule, toRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeTaskTransfer)
				if err := _DeTask.contract.UnpackLog(event, "Transfer", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTransfer is a log parse operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
func (_DeTask *DeTaskFilterer) ParseTransfer(log types.Log) (*DeTaskTransfer, error) {
	event := new(DeTaskTransfer)
	if err := _DeTask.contract.UnpackLog(event, "Transfer", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DeTaskUnlockedIterator is returned from FilterUnlocked and is used to iterate over the raw logs and unpacked data for Unlocked events raised by the DeTask contract.
type DeTaskUnlockedIterator struct {
	Event *DeTaskUnlocked // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *DeTaskUnlockedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeTaskUnlocked)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(DeTaskUnlocked)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *DeTaskUnlockedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeTaskUnlockedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeTaskUnlocked represents a Unlocked event raised by the DeTask contract.
type DeTaskUnlocked struct {
	TokenId *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterUnlocked is a free log retrieval operation binding the contract event 0xf27b6ce5b2f5e68ddb2fd95a8a909d4ecf1daaac270935fff052feacb24f1842.
//
// Solidity: event Unlocked(uint256 tokenId)
func (_DeTask *DeTaskFilterer) FilterUnlocked(opts *bind.FilterOpts) (*DeTaskUnlockedIterator, error) {

	logs, sub, err := _DeTask.contract.FilterLogs(opts, "Unlocked")
	if err != nil {
		return nil, err
	}
	return &DeTaskUnlockedIterator{contract: _DeTask.contract, event: "Unlocked", logs: logs, sub: sub}, nil
}

// WatchUnlocked is a free log subscription operation binding the contract event 0xf27b6ce5b2f5e68ddb2fd95a8a909d4ecf1daaac270935fff052feacb24f1842.
//
// Solidity: event Unlocked(uint256 tokenId)
func (_DeTask *DeTaskFilterer) WatchUnlocked(opts *bind.WatchOpts, sink chan<- *DeTaskUnlocked) (event.Subscription, error) {

	logs, sub, err := _DeTask.contract.WatchLogs(opts, "Unlocked")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeTaskUnlocked)
				if err := _DeTask.contract.UnpackLog(event, "Unlocked", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseUnlocked is a log parse operation binding the contract event 0xf27b6ce5b2f5e68ddb2fd95a8a909d4ecf1daaac270935fff052feacb24f1842.
//
// Solidity: event Unlocked(uint256 tokenId)
func (_DeTask *DeTaskFilterer) ParseUnlocked(log types.Log) (*DeTaskUnlocked, error) {
	event := new(DeTaskUnlocked)
	if err := _DeTask.contract.UnpackLog(event, "Unlocked", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
