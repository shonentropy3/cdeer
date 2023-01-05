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

// DeStageStage is an auto generated low-level Go binding around an user-defined struct.
type DeStageStage struct {
	Amount *big.Int
	Period uint32
	Status uint8
}

// DeStageMetaData contains all meta data concerning the DeStage contract.
var DeStageMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_order\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[],\"name\":\"AmountError\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"InvalidCaller\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"ParamError\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"StatusError\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"orderId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"period\",\"type\":\"uint256\"}],\"name\":\"AppendStage\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"orderId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"stageIndex\",\"type\":\"uint256\"}],\"name\":\"ConfirmOrderStage\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"orderId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"stageIndex\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"appendPeriod\",\"type\":\"uint256\"}],\"name\":\"ProlongStage\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"deorder\",\"type\":\"address\"}],\"name\":\"SetDeorder\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"max\",\"type\":\"uint256\"}],\"name\":\"SetMaxStages\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"orderId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256[]\",\"name\":\"amounts\",\"type\":\"uint256[]\"},{\"indexed\":false,\"internalType\":\"uint256[]\",\"name\":\"periods\",\"type\":\"uint256[]\"}],\"name\":\"SetStage\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_orderId\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"issuerAbort\",\"type\":\"bool\"}],\"name\":\"abortOrder\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"currStageIndex\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"issuerAmount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"workerAmount\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_orderId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_amount\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_period\",\"type\":\"uint256\"}],\"name\":\"appendStage\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_orderId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_stageIndex\",\"type\":\"uint256\"}],\"name\":\"confirmDelivery\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"deOrder\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_orderId\",\"type\":\"uint256\"}],\"name\":\"getStages\",\"outputs\":[{\"components\":[{\"internalType\":\"uint96\",\"name\":\"amount\",\"type\":\"uint96\"},{\"internalType\":\"uint32\",\"name\":\"period\",\"type\":\"uint32\"},{\"internalType\":\"enumDeStage.StageStatus\",\"name\":\"status\",\"type\":\"uint8\"}],\"internalType\":\"structDeStage.Stage[]\",\"name\":\"stages\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"maxStages\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_orderId\",\"type\":\"uint256\"}],\"name\":\"ongoingStage\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"stageIndex\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"stageStartDate\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_orderId\",\"type\":\"uint256\"}],\"name\":\"pendingWithdraw\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"pending\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"nextStage\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_orderId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_stageIndex\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_appendPeriod\",\"type\":\"uint256\"}],\"name\":\"prolongStage\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_order\",\"type\":\"address\"}],\"name\":\"setDeOrder\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint8\",\"name\":\"_maxStages\",\"type\":\"uint8\"}],\"name\":\"setMaxStages\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_orderId\",\"type\":\"uint256\"},{\"internalType\":\"uint256[]\",\"name\":\"_amounts\",\"type\":\"uint256[]\"},{\"internalType\":\"uint256[]\",\"name\":\"_periods\",\"type\":\"uint256[]\"}],\"name\":\"setStage\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"orderId\",\"type\":\"uint256\"}],\"name\":\"stagesLength\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"len\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_orderId\",\"type\":\"uint256\"}],\"name\":\"startOrder\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"orderId\",\"type\":\"uint256\"}],\"name\":\"totalAmount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"total\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"orderId\",\"type\":\"uint256\"}],\"name\":\"totalStagePeriod\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"total\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_orderId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_nextStage\",\"type\":\"uint256\"}],\"name\":\"withdrawStage\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
}

// DeStageABI is the input ABI used to generate the binding from.
// Deprecated: Use DeStageMetaData.ABI instead.
var DeStageABI = DeStageMetaData.ABI

// DeStage is an auto generated Go binding around an Ethereum contract.
type DeStage struct {
	DeStageCaller     // Read-only binding to the contract
	DeStageTransactor // Write-only binding to the contract
	DeStageFilterer   // Log filterer for contract events
}

// DeStageCaller is an auto generated read-only Go binding around an Ethereum contract.
type DeStageCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// DeStageTransactor is an auto generated write-only Go binding around an Ethereum contract.
type DeStageTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// DeStageFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type DeStageFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// DeStageSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type DeStageSession struct {
	Contract     *DeStage          // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// DeStageCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type DeStageCallerSession struct {
	Contract *DeStageCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts  // Call options to use throughout this session
}

// DeStageTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type DeStageTransactorSession struct {
	Contract     *DeStageTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts  // Transaction auth options to use throughout this session
}

// DeStageRaw is an auto generated low-level Go binding around an Ethereum contract.
type DeStageRaw struct {
	Contract *DeStage // Generic contract binding to access the raw methods on
}

// DeStageCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type DeStageCallerRaw struct {
	Contract *DeStageCaller // Generic read-only contract binding to access the raw methods on
}

// DeStageTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type DeStageTransactorRaw struct {
	Contract *DeStageTransactor // Generic write-only contract binding to access the raw methods on
}

// NewDeStage creates a new instance of DeStage, bound to a specific deployed contract.
func NewDeStage(address common.Address, backend bind.ContractBackend) (*DeStage, error) {
	contract, err := bindDeStage(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &DeStage{DeStageCaller: DeStageCaller{contract: contract}, DeStageTransactor: DeStageTransactor{contract: contract}, DeStageFilterer: DeStageFilterer{contract: contract}}, nil
}

// NewDeStageCaller creates a new read-only instance of DeStage, bound to a specific deployed contract.
func NewDeStageCaller(address common.Address, caller bind.ContractCaller) (*DeStageCaller, error) {
	contract, err := bindDeStage(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &DeStageCaller{contract: contract}, nil
}

// NewDeStageTransactor creates a new write-only instance of DeStage, bound to a specific deployed contract.
func NewDeStageTransactor(address common.Address, transactor bind.ContractTransactor) (*DeStageTransactor, error) {
	contract, err := bindDeStage(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &DeStageTransactor{contract: contract}, nil
}

// NewDeStageFilterer creates a new log filterer instance of DeStage, bound to a specific deployed contract.
func NewDeStageFilterer(address common.Address, filterer bind.ContractFilterer) (*DeStageFilterer, error) {
	contract, err := bindDeStage(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &DeStageFilterer{contract: contract}, nil
}

// bindDeStage binds a generic wrapper to an already deployed contract.
func bindDeStage(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(DeStageABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_DeStage *DeStageRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _DeStage.Contract.DeStageCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_DeStage *DeStageRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _DeStage.Contract.DeStageTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_DeStage *DeStageRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _DeStage.Contract.DeStageTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_DeStage *DeStageCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _DeStage.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_DeStage *DeStageTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _DeStage.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_DeStage *DeStageTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _DeStage.Contract.contract.Transact(opts, method, params...)
}

// DeOrder is a free data retrieval call binding the contract method 0x645e7732.
//
// Solidity: function deOrder() view returns(address)
func (_DeStage *DeStageCaller) DeOrder(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _DeStage.contract.Call(opts, &out, "deOrder")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// DeOrder is a free data retrieval call binding the contract method 0x645e7732.
//
// Solidity: function deOrder() view returns(address)
func (_DeStage *DeStageSession) DeOrder() (common.Address, error) {
	return _DeStage.Contract.DeOrder(&_DeStage.CallOpts)
}

// DeOrder is a free data retrieval call binding the contract method 0x645e7732.
//
// Solidity: function deOrder() view returns(address)
func (_DeStage *DeStageCallerSession) DeOrder() (common.Address, error) {
	return _DeStage.Contract.DeOrder(&_DeStage.CallOpts)
}

// GetStages is a free data retrieval call binding the contract method 0xef8cccb0.
//
// Solidity: function getStages(uint256 _orderId) view returns((uint96,uint32,uint8)[] stages)
func (_DeStage *DeStageCaller) GetStages(opts *bind.CallOpts, _orderId *big.Int) ([]DeStageStage, error) {
	var out []interface{}
	err := _DeStage.contract.Call(opts, &out, "getStages", _orderId)

	if err != nil {
		return *new([]DeStageStage), err
	}

	out0 := *abi.ConvertType(out[0], new([]DeStageStage)).(*[]DeStageStage)

	return out0, err

}

// GetStages is a free data retrieval call binding the contract method 0xef8cccb0.
//
// Solidity: function getStages(uint256 _orderId) view returns((uint96,uint32,uint8)[] stages)
func (_DeStage *DeStageSession) GetStages(_orderId *big.Int) ([]DeStageStage, error) {
	return _DeStage.Contract.GetStages(&_DeStage.CallOpts, _orderId)
}

// GetStages is a free data retrieval call binding the contract method 0xef8cccb0.
//
// Solidity: function getStages(uint256 _orderId) view returns((uint96,uint32,uint8)[] stages)
func (_DeStage *DeStageCallerSession) GetStages(_orderId *big.Int) ([]DeStageStage, error) {
	return _DeStage.Contract.GetStages(&_DeStage.CallOpts, _orderId)
}

// MaxStages is a free data retrieval call binding the contract method 0x92e749e3.
//
// Solidity: function maxStages() view returns(uint256)
func (_DeStage *DeStageCaller) MaxStages(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _DeStage.contract.Call(opts, &out, "maxStages")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// MaxStages is a free data retrieval call binding the contract method 0x92e749e3.
//
// Solidity: function maxStages() view returns(uint256)
func (_DeStage *DeStageSession) MaxStages() (*big.Int, error) {
	return _DeStage.Contract.MaxStages(&_DeStage.CallOpts)
}

// MaxStages is a free data retrieval call binding the contract method 0x92e749e3.
//
// Solidity: function maxStages() view returns(uint256)
func (_DeStage *DeStageCallerSession) MaxStages() (*big.Int, error) {
	return _DeStage.Contract.MaxStages(&_DeStage.CallOpts)
}

// OngoingStage is a free data retrieval call binding the contract method 0x59ac59eb.
//
// Solidity: function ongoingStage(uint256 _orderId) view returns(uint256 stageIndex, uint256 stageStartDate)
func (_DeStage *DeStageCaller) OngoingStage(opts *bind.CallOpts, _orderId *big.Int) (struct {
	StageIndex     *big.Int
	StageStartDate *big.Int
}, error) {
	var out []interface{}
	err := _DeStage.contract.Call(opts, &out, "ongoingStage", _orderId)

	outstruct := new(struct {
		StageIndex     *big.Int
		StageStartDate *big.Int
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.StageIndex = *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	outstruct.StageStartDate = *abi.ConvertType(out[1], new(*big.Int)).(**big.Int)

	return *outstruct, err

}

// OngoingStage is a free data retrieval call binding the contract method 0x59ac59eb.
//
// Solidity: function ongoingStage(uint256 _orderId) view returns(uint256 stageIndex, uint256 stageStartDate)
func (_DeStage *DeStageSession) OngoingStage(_orderId *big.Int) (struct {
	StageIndex     *big.Int
	StageStartDate *big.Int
}, error) {
	return _DeStage.Contract.OngoingStage(&_DeStage.CallOpts, _orderId)
}

// OngoingStage is a free data retrieval call binding the contract method 0x59ac59eb.
//
// Solidity: function ongoingStage(uint256 _orderId) view returns(uint256 stageIndex, uint256 stageStartDate)
func (_DeStage *DeStageCallerSession) OngoingStage(_orderId *big.Int) (struct {
	StageIndex     *big.Int
	StageStartDate *big.Int
}, error) {
	return _DeStage.Contract.OngoingStage(&_DeStage.CallOpts, _orderId)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_DeStage *DeStageCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _DeStage.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_DeStage *DeStageSession) Owner() (common.Address, error) {
	return _DeStage.Contract.Owner(&_DeStage.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_DeStage *DeStageCallerSession) Owner() (common.Address, error) {
	return _DeStage.Contract.Owner(&_DeStage.CallOpts)
}

// PendingWithdraw is a free data retrieval call binding the contract method 0x2d72ac53.
//
// Solidity: function pendingWithdraw(uint256 _orderId) view returns(uint256 pending, uint256 nextStage)
func (_DeStage *DeStageCaller) PendingWithdraw(opts *bind.CallOpts, _orderId *big.Int) (struct {
	Pending   *big.Int
	NextStage *big.Int
}, error) {
	var out []interface{}
	err := _DeStage.contract.Call(opts, &out, "pendingWithdraw", _orderId)

	outstruct := new(struct {
		Pending   *big.Int
		NextStage *big.Int
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.Pending = *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	outstruct.NextStage = *abi.ConvertType(out[1], new(*big.Int)).(**big.Int)

	return *outstruct, err

}

// PendingWithdraw is a free data retrieval call binding the contract method 0x2d72ac53.
//
// Solidity: function pendingWithdraw(uint256 _orderId) view returns(uint256 pending, uint256 nextStage)
func (_DeStage *DeStageSession) PendingWithdraw(_orderId *big.Int) (struct {
	Pending   *big.Int
	NextStage *big.Int
}, error) {
	return _DeStage.Contract.PendingWithdraw(&_DeStage.CallOpts, _orderId)
}

// PendingWithdraw is a free data retrieval call binding the contract method 0x2d72ac53.
//
// Solidity: function pendingWithdraw(uint256 _orderId) view returns(uint256 pending, uint256 nextStage)
func (_DeStage *DeStageCallerSession) PendingWithdraw(_orderId *big.Int) (struct {
	Pending   *big.Int
	NextStage *big.Int
}, error) {
	return _DeStage.Contract.PendingWithdraw(&_DeStage.CallOpts, _orderId)
}

// StagesLength is a free data retrieval call binding the contract method 0xed1f751e.
//
// Solidity: function stagesLength(uint256 orderId) view returns(uint256 len)
func (_DeStage *DeStageCaller) StagesLength(opts *bind.CallOpts, orderId *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _DeStage.contract.Call(opts, &out, "stagesLength", orderId)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// StagesLength is a free data retrieval call binding the contract method 0xed1f751e.
//
// Solidity: function stagesLength(uint256 orderId) view returns(uint256 len)
func (_DeStage *DeStageSession) StagesLength(orderId *big.Int) (*big.Int, error) {
	return _DeStage.Contract.StagesLength(&_DeStage.CallOpts, orderId)
}

// StagesLength is a free data retrieval call binding the contract method 0xed1f751e.
//
// Solidity: function stagesLength(uint256 orderId) view returns(uint256 len)
func (_DeStage *DeStageCallerSession) StagesLength(orderId *big.Int) (*big.Int, error) {
	return _DeStage.Contract.StagesLength(&_DeStage.CallOpts, orderId)
}

// TotalAmount is a free data retrieval call binding the contract method 0x3ad42417.
//
// Solidity: function totalAmount(uint256 orderId) view returns(uint256 total)
func (_DeStage *DeStageCaller) TotalAmount(opts *bind.CallOpts, orderId *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _DeStage.contract.Call(opts, &out, "totalAmount", orderId)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TotalAmount is a free data retrieval call binding the contract method 0x3ad42417.
//
// Solidity: function totalAmount(uint256 orderId) view returns(uint256 total)
func (_DeStage *DeStageSession) TotalAmount(orderId *big.Int) (*big.Int, error) {
	return _DeStage.Contract.TotalAmount(&_DeStage.CallOpts, orderId)
}

// TotalAmount is a free data retrieval call binding the contract method 0x3ad42417.
//
// Solidity: function totalAmount(uint256 orderId) view returns(uint256 total)
func (_DeStage *DeStageCallerSession) TotalAmount(orderId *big.Int) (*big.Int, error) {
	return _DeStage.Contract.TotalAmount(&_DeStage.CallOpts, orderId)
}

// TotalStagePeriod is a free data retrieval call binding the contract method 0xb7014608.
//
// Solidity: function totalStagePeriod(uint256 orderId) view returns(uint256 total)
func (_DeStage *DeStageCaller) TotalStagePeriod(opts *bind.CallOpts, orderId *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _DeStage.contract.Call(opts, &out, "totalStagePeriod", orderId)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TotalStagePeriod is a free data retrieval call binding the contract method 0xb7014608.
//
// Solidity: function totalStagePeriod(uint256 orderId) view returns(uint256 total)
func (_DeStage *DeStageSession) TotalStagePeriod(orderId *big.Int) (*big.Int, error) {
	return _DeStage.Contract.TotalStagePeriod(&_DeStage.CallOpts, orderId)
}

// TotalStagePeriod is a free data retrieval call binding the contract method 0xb7014608.
//
// Solidity: function totalStagePeriod(uint256 orderId) view returns(uint256 total)
func (_DeStage *DeStageCallerSession) TotalStagePeriod(orderId *big.Int) (*big.Int, error) {
	return _DeStage.Contract.TotalStagePeriod(&_DeStage.CallOpts, orderId)
}

// AbortOrder is a paid mutator transaction binding the contract method 0x27c4c04a.
//
// Solidity: function abortOrder(uint256 _orderId, bool issuerAbort) returns(uint256 currStageIndex, uint256 issuerAmount, uint256 workerAmount)
func (_DeStage *DeStageTransactor) AbortOrder(opts *bind.TransactOpts, _orderId *big.Int, issuerAbort bool) (*types.Transaction, error) {
	return _DeStage.contract.Transact(opts, "abortOrder", _orderId, issuerAbort)
}

// AbortOrder is a paid mutator transaction binding the contract method 0x27c4c04a.
//
// Solidity: function abortOrder(uint256 _orderId, bool issuerAbort) returns(uint256 currStageIndex, uint256 issuerAmount, uint256 workerAmount)
func (_DeStage *DeStageSession) AbortOrder(_orderId *big.Int, issuerAbort bool) (*types.Transaction, error) {
	return _DeStage.Contract.AbortOrder(&_DeStage.TransactOpts, _orderId, issuerAbort)
}

// AbortOrder is a paid mutator transaction binding the contract method 0x27c4c04a.
//
// Solidity: function abortOrder(uint256 _orderId, bool issuerAbort) returns(uint256 currStageIndex, uint256 issuerAmount, uint256 workerAmount)
func (_DeStage *DeStageTransactorSession) AbortOrder(_orderId *big.Int, issuerAbort bool) (*types.Transaction, error) {
	return _DeStage.Contract.AbortOrder(&_DeStage.TransactOpts, _orderId, issuerAbort)
}

// AppendStage is a paid mutator transaction binding the contract method 0x29cf478d.
//
// Solidity: function appendStage(uint256 _orderId, uint256 _amount, uint256 _period) returns()
func (_DeStage *DeStageTransactor) AppendStage(opts *bind.TransactOpts, _orderId *big.Int, _amount *big.Int, _period *big.Int) (*types.Transaction, error) {
	return _DeStage.contract.Transact(opts, "appendStage", _orderId, _amount, _period)
}

// AppendStage is a paid mutator transaction binding the contract method 0x29cf478d.
//
// Solidity: function appendStage(uint256 _orderId, uint256 _amount, uint256 _period) returns()
func (_DeStage *DeStageSession) AppendStage(_orderId *big.Int, _amount *big.Int, _period *big.Int) (*types.Transaction, error) {
	return _DeStage.Contract.AppendStage(&_DeStage.TransactOpts, _orderId, _amount, _period)
}

// AppendStage is a paid mutator transaction binding the contract method 0x29cf478d.
//
// Solidity: function appendStage(uint256 _orderId, uint256 _amount, uint256 _period) returns()
func (_DeStage *DeStageTransactorSession) AppendStage(_orderId *big.Int, _amount *big.Int, _period *big.Int) (*types.Transaction, error) {
	return _DeStage.Contract.AppendStage(&_DeStage.TransactOpts, _orderId, _amount, _period)
}

// ConfirmDelivery is a paid mutator transaction binding the contract method 0xf796a343.
//
// Solidity: function confirmDelivery(uint256 _orderId, uint256 _stageIndex) returns()
func (_DeStage *DeStageTransactor) ConfirmDelivery(opts *bind.TransactOpts, _orderId *big.Int, _stageIndex *big.Int) (*types.Transaction, error) {
	return _DeStage.contract.Transact(opts, "confirmDelivery", _orderId, _stageIndex)
}

// ConfirmDelivery is a paid mutator transaction binding the contract method 0xf796a343.
//
// Solidity: function confirmDelivery(uint256 _orderId, uint256 _stageIndex) returns()
func (_DeStage *DeStageSession) ConfirmDelivery(_orderId *big.Int, _stageIndex *big.Int) (*types.Transaction, error) {
	return _DeStage.Contract.ConfirmDelivery(&_DeStage.TransactOpts, _orderId, _stageIndex)
}

// ConfirmDelivery is a paid mutator transaction binding the contract method 0xf796a343.
//
// Solidity: function confirmDelivery(uint256 _orderId, uint256 _stageIndex) returns()
func (_DeStage *DeStageTransactorSession) ConfirmDelivery(_orderId *big.Int, _stageIndex *big.Int) (*types.Transaction, error) {
	return _DeStage.Contract.ConfirmDelivery(&_DeStage.TransactOpts, _orderId, _stageIndex)
}

// ProlongStage is a paid mutator transaction binding the contract method 0xd6fafb2c.
//
// Solidity: function prolongStage(uint256 _orderId, uint256 _stageIndex, uint256 _appendPeriod) returns()
func (_DeStage *DeStageTransactor) ProlongStage(opts *bind.TransactOpts, _orderId *big.Int, _stageIndex *big.Int, _appendPeriod *big.Int) (*types.Transaction, error) {
	return _DeStage.contract.Transact(opts, "prolongStage", _orderId, _stageIndex, _appendPeriod)
}

// ProlongStage is a paid mutator transaction binding the contract method 0xd6fafb2c.
//
// Solidity: function prolongStage(uint256 _orderId, uint256 _stageIndex, uint256 _appendPeriod) returns()
func (_DeStage *DeStageSession) ProlongStage(_orderId *big.Int, _stageIndex *big.Int, _appendPeriod *big.Int) (*types.Transaction, error) {
	return _DeStage.Contract.ProlongStage(&_DeStage.TransactOpts, _orderId, _stageIndex, _appendPeriod)
}

// ProlongStage is a paid mutator transaction binding the contract method 0xd6fafb2c.
//
// Solidity: function prolongStage(uint256 _orderId, uint256 _stageIndex, uint256 _appendPeriod) returns()
func (_DeStage *DeStageTransactorSession) ProlongStage(_orderId *big.Int, _stageIndex *big.Int, _appendPeriod *big.Int) (*types.Transaction, error) {
	return _DeStage.Contract.ProlongStage(&_DeStage.TransactOpts, _orderId, _stageIndex, _appendPeriod)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_DeStage *DeStageTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _DeStage.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_DeStage *DeStageSession) RenounceOwnership() (*types.Transaction, error) {
	return _DeStage.Contract.RenounceOwnership(&_DeStage.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_DeStage *DeStageTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _DeStage.Contract.RenounceOwnership(&_DeStage.TransactOpts)
}

// SetDeOrder is a paid mutator transaction binding the contract method 0x12a4b1c0.
//
// Solidity: function setDeOrder(address _order) returns()
func (_DeStage *DeStageTransactor) SetDeOrder(opts *bind.TransactOpts, _order common.Address) (*types.Transaction, error) {
	return _DeStage.contract.Transact(opts, "setDeOrder", _order)
}

// SetDeOrder is a paid mutator transaction binding the contract method 0x12a4b1c0.
//
// Solidity: function setDeOrder(address _order) returns()
func (_DeStage *DeStageSession) SetDeOrder(_order common.Address) (*types.Transaction, error) {
	return _DeStage.Contract.SetDeOrder(&_DeStage.TransactOpts, _order)
}

// SetDeOrder is a paid mutator transaction binding the contract method 0x12a4b1c0.
//
// Solidity: function setDeOrder(address _order) returns()
func (_DeStage *DeStageTransactorSession) SetDeOrder(_order common.Address) (*types.Transaction, error) {
	return _DeStage.Contract.SetDeOrder(&_DeStage.TransactOpts, _order)
}

// SetMaxStages is a paid mutator transaction binding the contract method 0x7e115b42.
//
// Solidity: function setMaxStages(uint8 _maxStages) returns()
func (_DeStage *DeStageTransactor) SetMaxStages(opts *bind.TransactOpts, _maxStages uint8) (*types.Transaction, error) {
	return _DeStage.contract.Transact(opts, "setMaxStages", _maxStages)
}

// SetMaxStages is a paid mutator transaction binding the contract method 0x7e115b42.
//
// Solidity: function setMaxStages(uint8 _maxStages) returns()
func (_DeStage *DeStageSession) SetMaxStages(_maxStages uint8) (*types.Transaction, error) {
	return _DeStage.Contract.SetMaxStages(&_DeStage.TransactOpts, _maxStages)
}

// SetMaxStages is a paid mutator transaction binding the contract method 0x7e115b42.
//
// Solidity: function setMaxStages(uint8 _maxStages) returns()
func (_DeStage *DeStageTransactorSession) SetMaxStages(_maxStages uint8) (*types.Transaction, error) {
	return _DeStage.Contract.SetMaxStages(&_DeStage.TransactOpts, _maxStages)
}

// SetStage is a paid mutator transaction binding the contract method 0x362231e1.
//
// Solidity: function setStage(uint256 _orderId, uint256[] _amounts, uint256[] _periods) returns()
func (_DeStage *DeStageTransactor) SetStage(opts *bind.TransactOpts, _orderId *big.Int, _amounts []*big.Int, _periods []*big.Int) (*types.Transaction, error) {
	return _DeStage.contract.Transact(opts, "setStage", _orderId, _amounts, _periods)
}

// SetStage is a paid mutator transaction binding the contract method 0x362231e1.
//
// Solidity: function setStage(uint256 _orderId, uint256[] _amounts, uint256[] _periods) returns()
func (_DeStage *DeStageSession) SetStage(_orderId *big.Int, _amounts []*big.Int, _periods []*big.Int) (*types.Transaction, error) {
	return _DeStage.Contract.SetStage(&_DeStage.TransactOpts, _orderId, _amounts, _periods)
}

// SetStage is a paid mutator transaction binding the contract method 0x362231e1.
//
// Solidity: function setStage(uint256 _orderId, uint256[] _amounts, uint256[] _periods) returns()
func (_DeStage *DeStageTransactorSession) SetStage(_orderId *big.Int, _amounts []*big.Int, _periods []*big.Int) (*types.Transaction, error) {
	return _DeStage.Contract.SetStage(&_DeStage.TransactOpts, _orderId, _amounts, _periods)
}

// StartOrder is a paid mutator transaction binding the contract method 0x7d41fdd9.
//
// Solidity: function startOrder(uint256 _orderId) returns()
func (_DeStage *DeStageTransactor) StartOrder(opts *bind.TransactOpts, _orderId *big.Int) (*types.Transaction, error) {
	return _DeStage.contract.Transact(opts, "startOrder", _orderId)
}

// StartOrder is a paid mutator transaction binding the contract method 0x7d41fdd9.
//
// Solidity: function startOrder(uint256 _orderId) returns()
func (_DeStage *DeStageSession) StartOrder(_orderId *big.Int) (*types.Transaction, error) {
	return _DeStage.Contract.StartOrder(&_DeStage.TransactOpts, _orderId)
}

// StartOrder is a paid mutator transaction binding the contract method 0x7d41fdd9.
//
// Solidity: function startOrder(uint256 _orderId) returns()
func (_DeStage *DeStageTransactorSession) StartOrder(_orderId *big.Int) (*types.Transaction, error) {
	return _DeStage.Contract.StartOrder(&_DeStage.TransactOpts, _orderId)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_DeStage *DeStageTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _DeStage.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_DeStage *DeStageSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _DeStage.Contract.TransferOwnership(&_DeStage.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_DeStage *DeStageTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _DeStage.Contract.TransferOwnership(&_DeStage.TransactOpts, newOwner)
}

// WithdrawStage is a paid mutator transaction binding the contract method 0xb9e9091c.
//
// Solidity: function withdrawStage(uint256 _orderId, uint256 _nextStage) returns()
func (_DeStage *DeStageTransactor) WithdrawStage(opts *bind.TransactOpts, _orderId *big.Int, _nextStage *big.Int) (*types.Transaction, error) {
	return _DeStage.contract.Transact(opts, "withdrawStage", _orderId, _nextStage)
}

// WithdrawStage is a paid mutator transaction binding the contract method 0xb9e9091c.
//
// Solidity: function withdrawStage(uint256 _orderId, uint256 _nextStage) returns()
func (_DeStage *DeStageSession) WithdrawStage(_orderId *big.Int, _nextStage *big.Int) (*types.Transaction, error) {
	return _DeStage.Contract.WithdrawStage(&_DeStage.TransactOpts, _orderId, _nextStage)
}

// WithdrawStage is a paid mutator transaction binding the contract method 0xb9e9091c.
//
// Solidity: function withdrawStage(uint256 _orderId, uint256 _nextStage) returns()
func (_DeStage *DeStageTransactorSession) WithdrawStage(_orderId *big.Int, _nextStage *big.Int) (*types.Transaction, error) {
	return _DeStage.Contract.WithdrawStage(&_DeStage.TransactOpts, _orderId, _nextStage)
}

// DeStageAppendStageIterator is returned from FilterAppendStage and is used to iterate over the raw logs and unpacked data for AppendStage events raised by the DeStage contract.
type DeStageAppendStageIterator struct {
	Event *DeStageAppendStage // Event containing the contract specifics and raw log

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
func (it *DeStageAppendStageIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeStageAppendStage)
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
		it.Event = new(DeStageAppendStage)
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
func (it *DeStageAppendStageIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeStageAppendStageIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeStageAppendStage represents a AppendStage event raised by the DeStage contract.
type DeStageAppendStage struct {
	OrderId *big.Int
	Amount  *big.Int
	Period  *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterAppendStage is a free log retrieval operation binding the contract event 0xfe21c1565116bcc6dd38b86e8ad093ad769866a2bda7ec261b0af259e5b980aa.
//
// Solidity: event AppendStage(uint256 indexed orderId, uint256 amount, uint256 period)
func (_DeStage *DeStageFilterer) FilterAppendStage(opts *bind.FilterOpts, orderId []*big.Int) (*DeStageAppendStageIterator, error) {

	var orderIdRule []interface{}
	for _, orderIdItem := range orderId {
		orderIdRule = append(orderIdRule, orderIdItem)
	}

	logs, sub, err := _DeStage.contract.FilterLogs(opts, "AppendStage", orderIdRule)
	if err != nil {
		return nil, err
	}
	return &DeStageAppendStageIterator{contract: _DeStage.contract, event: "AppendStage", logs: logs, sub: sub}, nil
}

// WatchAppendStage is a free log subscription operation binding the contract event 0xfe21c1565116bcc6dd38b86e8ad093ad769866a2bda7ec261b0af259e5b980aa.
//
// Solidity: event AppendStage(uint256 indexed orderId, uint256 amount, uint256 period)
func (_DeStage *DeStageFilterer) WatchAppendStage(opts *bind.WatchOpts, sink chan<- *DeStageAppendStage, orderId []*big.Int) (event.Subscription, error) {

	var orderIdRule []interface{}
	for _, orderIdItem := range orderId {
		orderIdRule = append(orderIdRule, orderIdItem)
	}

	logs, sub, err := _DeStage.contract.WatchLogs(opts, "AppendStage", orderIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeStageAppendStage)
				if err := _DeStage.contract.UnpackLog(event, "AppendStage", log); err != nil {
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

// ParseAppendStage is a log parse operation binding the contract event 0xfe21c1565116bcc6dd38b86e8ad093ad769866a2bda7ec261b0af259e5b980aa.
//
// Solidity: event AppendStage(uint256 indexed orderId, uint256 amount, uint256 period)
func (_DeStage *DeStageFilterer) ParseAppendStage(log types.Log) (*DeStageAppendStage, error) {
	event := new(DeStageAppendStage)
	if err := _DeStage.contract.UnpackLog(event, "AppendStage", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DeStageConfirmOrderStageIterator is returned from FilterConfirmOrderStage and is used to iterate over the raw logs and unpacked data for ConfirmOrderStage events raised by the DeStage contract.
type DeStageConfirmOrderStageIterator struct {
	Event *DeStageConfirmOrderStage // Event containing the contract specifics and raw log

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
func (it *DeStageConfirmOrderStageIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeStageConfirmOrderStage)
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
		it.Event = new(DeStageConfirmOrderStage)
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
func (it *DeStageConfirmOrderStageIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeStageConfirmOrderStageIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeStageConfirmOrderStage represents a ConfirmOrderStage event raised by the DeStage contract.
type DeStageConfirmOrderStage struct {
	OrderId    *big.Int
	StageIndex *big.Int
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterConfirmOrderStage is a free log retrieval operation binding the contract event 0x53182a8b7a3c3c3cab7d343a3256f3b24f11a2c9637aef95199bd47159cb783d.
//
// Solidity: event ConfirmOrderStage(uint256 indexed orderId, uint256 stageIndex)
func (_DeStage *DeStageFilterer) FilterConfirmOrderStage(opts *bind.FilterOpts, orderId []*big.Int) (*DeStageConfirmOrderStageIterator, error) {

	var orderIdRule []interface{}
	for _, orderIdItem := range orderId {
		orderIdRule = append(orderIdRule, orderIdItem)
	}

	logs, sub, err := _DeStage.contract.FilterLogs(opts, "ConfirmOrderStage", orderIdRule)
	if err != nil {
		return nil, err
	}
	return &DeStageConfirmOrderStageIterator{contract: _DeStage.contract, event: "ConfirmOrderStage", logs: logs, sub: sub}, nil
}

// WatchConfirmOrderStage is a free log subscription operation binding the contract event 0x53182a8b7a3c3c3cab7d343a3256f3b24f11a2c9637aef95199bd47159cb783d.
//
// Solidity: event ConfirmOrderStage(uint256 indexed orderId, uint256 stageIndex)
func (_DeStage *DeStageFilterer) WatchConfirmOrderStage(opts *bind.WatchOpts, sink chan<- *DeStageConfirmOrderStage, orderId []*big.Int) (event.Subscription, error) {

	var orderIdRule []interface{}
	for _, orderIdItem := range orderId {
		orderIdRule = append(orderIdRule, orderIdItem)
	}

	logs, sub, err := _DeStage.contract.WatchLogs(opts, "ConfirmOrderStage", orderIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeStageConfirmOrderStage)
				if err := _DeStage.contract.UnpackLog(event, "ConfirmOrderStage", log); err != nil {
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

// ParseConfirmOrderStage is a log parse operation binding the contract event 0x53182a8b7a3c3c3cab7d343a3256f3b24f11a2c9637aef95199bd47159cb783d.
//
// Solidity: event ConfirmOrderStage(uint256 indexed orderId, uint256 stageIndex)
func (_DeStage *DeStageFilterer) ParseConfirmOrderStage(log types.Log) (*DeStageConfirmOrderStage, error) {
	event := new(DeStageConfirmOrderStage)
	if err := _DeStage.contract.UnpackLog(event, "ConfirmOrderStage", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DeStageOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the DeStage contract.
type DeStageOwnershipTransferredIterator struct {
	Event *DeStageOwnershipTransferred // Event containing the contract specifics and raw log

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
func (it *DeStageOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeStageOwnershipTransferred)
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
		it.Event = new(DeStageOwnershipTransferred)
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
func (it *DeStageOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeStageOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeStageOwnershipTransferred represents a OwnershipTransferred event raised by the DeStage contract.
type DeStageOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_DeStage *DeStageFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*DeStageOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _DeStage.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &DeStageOwnershipTransferredIterator{contract: _DeStage.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_DeStage *DeStageFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *DeStageOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _DeStage.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeStageOwnershipTransferred)
				if err := _DeStage.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
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
func (_DeStage *DeStageFilterer) ParseOwnershipTransferred(log types.Log) (*DeStageOwnershipTransferred, error) {
	event := new(DeStageOwnershipTransferred)
	if err := _DeStage.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DeStageProlongStageIterator is returned from FilterProlongStage and is used to iterate over the raw logs and unpacked data for ProlongStage events raised by the DeStage contract.
type DeStageProlongStageIterator struct {
	Event *DeStageProlongStage // Event containing the contract specifics and raw log

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
func (it *DeStageProlongStageIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeStageProlongStage)
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
		it.Event = new(DeStageProlongStage)
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
func (it *DeStageProlongStageIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeStageProlongStageIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeStageProlongStage represents a ProlongStage event raised by the DeStage contract.
type DeStageProlongStage struct {
	OrderId      *big.Int
	StageIndex   *big.Int
	AppendPeriod *big.Int
	Raw          types.Log // Blockchain specific contextual infos
}

// FilterProlongStage is a free log retrieval operation binding the contract event 0x5a4b481a886d8dbf31ab860a2b1045da1c4df5585248f8012f0161b78fc21ff0.
//
// Solidity: event ProlongStage(uint256 indexed orderId, uint256 stageIndex, uint256 appendPeriod)
func (_DeStage *DeStageFilterer) FilterProlongStage(opts *bind.FilterOpts, orderId []*big.Int) (*DeStageProlongStageIterator, error) {

	var orderIdRule []interface{}
	for _, orderIdItem := range orderId {
		orderIdRule = append(orderIdRule, orderIdItem)
	}

	logs, sub, err := _DeStage.contract.FilterLogs(opts, "ProlongStage", orderIdRule)
	if err != nil {
		return nil, err
	}
	return &DeStageProlongStageIterator{contract: _DeStage.contract, event: "ProlongStage", logs: logs, sub: sub}, nil
}

// WatchProlongStage is a free log subscription operation binding the contract event 0x5a4b481a886d8dbf31ab860a2b1045da1c4df5585248f8012f0161b78fc21ff0.
//
// Solidity: event ProlongStage(uint256 indexed orderId, uint256 stageIndex, uint256 appendPeriod)
func (_DeStage *DeStageFilterer) WatchProlongStage(opts *bind.WatchOpts, sink chan<- *DeStageProlongStage, orderId []*big.Int) (event.Subscription, error) {

	var orderIdRule []interface{}
	for _, orderIdItem := range orderId {
		orderIdRule = append(orderIdRule, orderIdItem)
	}

	logs, sub, err := _DeStage.contract.WatchLogs(opts, "ProlongStage", orderIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeStageProlongStage)
				if err := _DeStage.contract.UnpackLog(event, "ProlongStage", log); err != nil {
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

// ParseProlongStage is a log parse operation binding the contract event 0x5a4b481a886d8dbf31ab860a2b1045da1c4df5585248f8012f0161b78fc21ff0.
//
// Solidity: event ProlongStage(uint256 indexed orderId, uint256 stageIndex, uint256 appendPeriod)
func (_DeStage *DeStageFilterer) ParseProlongStage(log types.Log) (*DeStageProlongStage, error) {
	event := new(DeStageProlongStage)
	if err := _DeStage.contract.UnpackLog(event, "ProlongStage", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DeStageSetDeorderIterator is returned from FilterSetDeorder and is used to iterate over the raw logs and unpacked data for SetDeorder events raised by the DeStage contract.
type DeStageSetDeorderIterator struct {
	Event *DeStageSetDeorder // Event containing the contract specifics and raw log

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
func (it *DeStageSetDeorderIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeStageSetDeorder)
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
		it.Event = new(DeStageSetDeorder)
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
func (it *DeStageSetDeorderIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeStageSetDeorderIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeStageSetDeorder represents a SetDeorder event raised by the DeStage contract.
type DeStageSetDeorder struct {
	Deorder common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterSetDeorder is a free log retrieval operation binding the contract event 0x4b58f74ec197938fcc853dfa111f26fa877bc2773d1cf741d09cf8fa415b7862.
//
// Solidity: event SetDeorder(address deorder)
func (_DeStage *DeStageFilterer) FilterSetDeorder(opts *bind.FilterOpts) (*DeStageSetDeorderIterator, error) {

	logs, sub, err := _DeStage.contract.FilterLogs(opts, "SetDeorder")
	if err != nil {
		return nil, err
	}
	return &DeStageSetDeorderIterator{contract: _DeStage.contract, event: "SetDeorder", logs: logs, sub: sub}, nil
}

// WatchSetDeorder is a free log subscription operation binding the contract event 0x4b58f74ec197938fcc853dfa111f26fa877bc2773d1cf741d09cf8fa415b7862.
//
// Solidity: event SetDeorder(address deorder)
func (_DeStage *DeStageFilterer) WatchSetDeorder(opts *bind.WatchOpts, sink chan<- *DeStageSetDeorder) (event.Subscription, error) {

	logs, sub, err := _DeStage.contract.WatchLogs(opts, "SetDeorder")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeStageSetDeorder)
				if err := _DeStage.contract.UnpackLog(event, "SetDeorder", log); err != nil {
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

// ParseSetDeorder is a log parse operation binding the contract event 0x4b58f74ec197938fcc853dfa111f26fa877bc2773d1cf741d09cf8fa415b7862.
//
// Solidity: event SetDeorder(address deorder)
func (_DeStage *DeStageFilterer) ParseSetDeorder(log types.Log) (*DeStageSetDeorder, error) {
	event := new(DeStageSetDeorder)
	if err := _DeStage.contract.UnpackLog(event, "SetDeorder", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DeStageSetMaxStagesIterator is returned from FilterSetMaxStages and is used to iterate over the raw logs and unpacked data for SetMaxStages events raised by the DeStage contract.
type DeStageSetMaxStagesIterator struct {
	Event *DeStageSetMaxStages // Event containing the contract specifics and raw log

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
func (it *DeStageSetMaxStagesIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeStageSetMaxStages)
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
		it.Event = new(DeStageSetMaxStages)
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
func (it *DeStageSetMaxStagesIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeStageSetMaxStagesIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeStageSetMaxStages represents a SetMaxStages event raised by the DeStage contract.
type DeStageSetMaxStages struct {
	Max *big.Int
	Raw types.Log // Blockchain specific contextual infos
}

// FilterSetMaxStages is a free log retrieval operation binding the contract event 0xdebfa6f1aacb1c6e293f587cfc684a3fc12ffee1350fa9f6149f4e96fc2d54ec.
//
// Solidity: event SetMaxStages(uint256 max)
func (_DeStage *DeStageFilterer) FilterSetMaxStages(opts *bind.FilterOpts) (*DeStageSetMaxStagesIterator, error) {

	logs, sub, err := _DeStage.contract.FilterLogs(opts, "SetMaxStages")
	if err != nil {
		return nil, err
	}
	return &DeStageSetMaxStagesIterator{contract: _DeStage.contract, event: "SetMaxStages", logs: logs, sub: sub}, nil
}

// WatchSetMaxStages is a free log subscription operation binding the contract event 0xdebfa6f1aacb1c6e293f587cfc684a3fc12ffee1350fa9f6149f4e96fc2d54ec.
//
// Solidity: event SetMaxStages(uint256 max)
func (_DeStage *DeStageFilterer) WatchSetMaxStages(opts *bind.WatchOpts, sink chan<- *DeStageSetMaxStages) (event.Subscription, error) {

	logs, sub, err := _DeStage.contract.WatchLogs(opts, "SetMaxStages")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeStageSetMaxStages)
				if err := _DeStage.contract.UnpackLog(event, "SetMaxStages", log); err != nil {
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

// ParseSetMaxStages is a log parse operation binding the contract event 0xdebfa6f1aacb1c6e293f587cfc684a3fc12ffee1350fa9f6149f4e96fc2d54ec.
//
// Solidity: event SetMaxStages(uint256 max)
func (_DeStage *DeStageFilterer) ParseSetMaxStages(log types.Log) (*DeStageSetMaxStages, error) {
	event := new(DeStageSetMaxStages)
	if err := _DeStage.contract.UnpackLog(event, "SetMaxStages", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DeStageSetStageIterator is returned from FilterSetStage and is used to iterate over the raw logs and unpacked data for SetStage events raised by the DeStage contract.
type DeStageSetStageIterator struct {
	Event *DeStageSetStage // Event containing the contract specifics and raw log

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
func (it *DeStageSetStageIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DeStageSetStage)
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
		it.Event = new(DeStageSetStage)
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
func (it *DeStageSetStageIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DeStageSetStageIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DeStageSetStage represents a SetStage event raised by the DeStage contract.
type DeStageSetStage struct {
	OrderId *big.Int
	Amounts []*big.Int
	Periods []*big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterSetStage is a free log retrieval operation binding the contract event 0x2afaf2443808078691312232696466d71cd881f3b4529e39d9d72fd15c15eb12.
//
// Solidity: event SetStage(uint256 indexed orderId, uint256[] amounts, uint256[] periods)
func (_DeStage *DeStageFilterer) FilterSetStage(opts *bind.FilterOpts, orderId []*big.Int) (*DeStageSetStageIterator, error) {

	var orderIdRule []interface{}
	for _, orderIdItem := range orderId {
		orderIdRule = append(orderIdRule, orderIdItem)
	}

	logs, sub, err := _DeStage.contract.FilterLogs(opts, "SetStage", orderIdRule)
	if err != nil {
		return nil, err
	}
	return &DeStageSetStageIterator{contract: _DeStage.contract, event: "SetStage", logs: logs, sub: sub}, nil
}

// WatchSetStage is a free log subscription operation binding the contract event 0x2afaf2443808078691312232696466d71cd881f3b4529e39d9d72fd15c15eb12.
//
// Solidity: event SetStage(uint256 indexed orderId, uint256[] amounts, uint256[] periods)
func (_DeStage *DeStageFilterer) WatchSetStage(opts *bind.WatchOpts, sink chan<- *DeStageSetStage, orderId []*big.Int) (event.Subscription, error) {

	var orderIdRule []interface{}
	for _, orderIdItem := range orderId {
		orderIdRule = append(orderIdRule, orderIdItem)
	}

	logs, sub, err := _DeStage.contract.WatchLogs(opts, "SetStage", orderIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DeStageSetStage)
				if err := _DeStage.contract.UnpackLog(event, "SetStage", log); err != nil {
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

// ParseSetStage is a log parse operation binding the contract event 0x2afaf2443808078691312232696466d71cd881f3b4529e39d9d72fd15c15eb12.
//
// Solidity: event SetStage(uint256 indexed orderId, uint256[] amounts, uint256[] periods)
func (_DeStage *DeStageFilterer) ParseSetStage(log types.Log) (*DeStageSetStage, error) {
	event := new(DeStageSetStage)
	if err := _DeStage.contract.UnpackLog(event, "SetStage", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
