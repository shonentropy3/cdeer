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
	Disabled   bool
}

// StorageMetaData contains all meta data concerning the Storage contract.
var StorageMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"worker\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"cost\",\"type\":\"uint256\"}],\"name\":\"ApplyFor\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"approved\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"}],\"name\":\"ApprovalForAll\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"worker\",\"type\":\"address\"}],\"name\":\"CancelApply\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Locked\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"taskFee\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"applyFee\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"feeReceiver\",\"type\":\"address\"}],\"name\":\"ModifyFee\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"issuer\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"title\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"desc\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"attachment\",\"type\":\"string\"},{\"internalType\":\"uint8\",\"name\":\"currency\",\"type\":\"uint8\"},{\"internalType\":\"uint112\",\"name\":\"budget\",\"type\":\"uint112\"},{\"internalType\":\"uint32\",\"name\":\"period\",\"type\":\"uint32\"},{\"internalType\":\"uint48\",\"name\":\"skills\",\"type\":\"uint48\"},{\"internalType\":\"bool\",\"name\":\"disabled\",\"type\":\"bool\"}],\"indexed\":false,\"internalType\":\"structTaskInfo\",\"name\":\"task\",\"type\":\"tuple\"}],\"name\":\"TaskCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"disabled\",\"type\":\"bool\"}],\"name\":\"TaskDisabled\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"issuer\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"title\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"desc\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"attachment\",\"type\":\"string\"},{\"internalType\":\"uint8\",\"name\":\"currency\",\"type\":\"uint8\"},{\"internalType\":\"uint112\",\"name\":\"budget\",\"type\":\"uint112\"},{\"internalType\":\"uint32\",\"name\":\"period\",\"type\":\"uint32\"},{\"internalType\":\"uint48\",\"name\":\"skills\",\"type\":\"uint48\"},{\"internalType\":\"bool\",\"name\":\"disabled\",\"type\":\"bool\"}],\"indexed\":false,\"internalType\":\"structTaskInfo\",\"name\":\"task\",\"type\":\"tuple\"}],\"name\":\"TaskModified\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Unlocked\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"who\",\"type\":\"address\"},{\"internalType\":\"uint256[]\",\"name\":\"_taskIds\",\"type\":\"uint256[]\"},{\"internalType\":\"uint256[]\",\"name\":\"costs\",\"type\":\"uint256[]\"},{\"internalType\":\"uint256[]\",\"name\":\"cancelIds\",\"type\":\"uint256[]\"}],\"name\":\"applyAndCancel\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"who\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_cost\",\"type\":\"uint256\"}],\"name\":\"applyFor\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"}],\"name\":\"cancelApply\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"who\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"title\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"desc\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"attachment\",\"type\":\"string\"},{\"internalType\":\"uint8\",\"name\":\"currency\",\"type\":\"uint8\"},{\"internalType\":\"uint112\",\"name\":\"budget\",\"type\":\"uint112\"},{\"internalType\":\"uint32\",\"name\":\"period\",\"type\":\"uint32\"},{\"internalType\":\"uint48\",\"name\":\"skills\",\"type\":\"uint48\"},{\"internalType\":\"bool\",\"name\":\"disabled\",\"type\":\"bool\"}],\"internalType\":\"structTaskInfo\",\"name\":\"task\",\"type\":\"tuple\"}],\"name\":\"createTask\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"_disabled\",\"type\":\"bool\"}],\"name\":\"disableTask\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"getApproved\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"isApprovedForAll\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"locked\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"metadataAddr\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"title\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"desc\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"attachment\",\"type\":\"string\"},{\"internalType\":\"uint8\",\"name\":\"currency\",\"type\":\"uint8\"},{\"internalType\":\"uint112\",\"name\":\"budget\",\"type\":\"uint112\"},{\"internalType\":\"uint32\",\"name\":\"period\",\"type\":\"uint32\"},{\"internalType\":\"uint48\",\"name\":\"skills\",\"type\":\"uint48\"},{\"internalType\":\"bool\",\"name\":\"disabled\",\"type\":\"bool\"}],\"internalType\":\"structTaskInfo\",\"name\":\"task\",\"type\":\"tuple\"}],\"name\":\"modifyTask\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"order\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"ownerOf\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"name\":\"setApprovalForAll\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_meta\",\"type\":\"address\"}],\"name\":\"setMetadataContract\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_order\",\"type\":\"address\"}],\"name\":\"setOrder\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"interfaceId\",\"type\":\"bytes4\"}],\"name\":\"supportsInterface\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"tasks\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"title\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"desc\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"attachment\",\"type\":\"string\"},{\"internalType\":\"uint8\",\"name\":\"currency\",\"type\":\"uint8\"},{\"internalType\":\"uint112\",\"name\":\"budget\",\"type\":\"uint112\"},{\"internalType\":\"uint32\",\"name\":\"period\",\"type\":\"uint32\"},{\"internalType\":\"uint48\",\"name\":\"skills\",\"type\":\"uint48\"},{\"internalType\":\"bool\",\"name\":\"disabled\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"tokenURI\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transferFee\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_taskFee\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_applyFee\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"_receiver\",\"type\":\"address\"}],\"name\":\"updateFeeReceiver\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
}

// StorageABI is the input ABI used to generate the binding from.
// Deprecated: Use StorageMetaData.ABI instead.
var StorageABI = StorageMetaData.ABI

// Storage is an auto generated Go binding around an Ethereum contract.
type Storage struct {
	StorageCaller     // Read-only binding to the contract
	StorageTransactor // Write-only binding to the contract
	StorageFilterer   // Log filterer for contract events
}

// StorageCaller is an auto generated read-only Go binding around an Ethereum contract.
type StorageCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// StorageTransactor is an auto generated write-only Go binding around an Ethereum contract.
type StorageTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// StorageFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type StorageFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// StorageSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type StorageSession struct {
	Contract     *Storage          // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// StorageCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type StorageCallerSession struct {
	Contract *StorageCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts  // Call options to use throughout this session
}

// StorageTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type StorageTransactorSession struct {
	Contract     *StorageTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts  // Transaction auth options to use throughout this session
}

// StorageRaw is an auto generated low-level Go binding around an Ethereum contract.
type StorageRaw struct {
	Contract *Storage // Generic contract binding to access the raw methods on
}

// StorageCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type StorageCallerRaw struct {
	Contract *StorageCaller // Generic read-only contract binding to access the raw methods on
}

// StorageTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type StorageTransactorRaw struct {
	Contract *StorageTransactor // Generic write-only contract binding to access the raw methods on
}

// NewStorage creates a new instance of Storage, bound to a specific deployed contract.
func NewStorage(address common.Address, backend bind.ContractBackend) (*Storage, error) {
	contract, err := bindStorage(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &Storage{StorageCaller: StorageCaller{contract: contract}, StorageTransactor: StorageTransactor{contract: contract}, StorageFilterer: StorageFilterer{contract: contract}}, nil
}

// NewStorageCaller creates a new read-only instance of Storage, bound to a specific deployed contract.
func NewStorageCaller(address common.Address, caller bind.ContractCaller) (*StorageCaller, error) {
	contract, err := bindStorage(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &StorageCaller{contract: contract}, nil
}

// NewStorageTransactor creates a new write-only instance of Storage, bound to a specific deployed contract.
func NewStorageTransactor(address common.Address, transactor bind.ContractTransactor) (*StorageTransactor, error) {
	contract, err := bindStorage(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &StorageTransactor{contract: contract}, nil
}

// NewStorageFilterer creates a new log filterer instance of Storage, bound to a specific deployed contract.
func NewStorageFilterer(address common.Address, filterer bind.ContractFilterer) (*StorageFilterer, error) {
	contract, err := bindStorage(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &StorageFilterer{contract: contract}, nil
}

// bindStorage binds a generic wrapper to an already deployed contract.
func bindStorage(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(StorageABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Storage *StorageRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Storage.Contract.StorageCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Storage *StorageRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Storage.Contract.StorageTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Storage *StorageRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Storage.Contract.StorageTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Storage *StorageCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Storage.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Storage *StorageTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Storage.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Storage *StorageTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Storage.Contract.contract.Transact(opts, method, params...)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address owner) view returns(uint256)
func (_Storage *StorageCaller) BalanceOf(opts *bind.CallOpts, owner common.Address) (*big.Int, error) {
	var out []interface{}
	err := _Storage.contract.Call(opts, &out, "balanceOf", owner)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address owner) view returns(uint256)
func (_Storage *StorageSession) BalanceOf(owner common.Address) (*big.Int, error) {
	return _Storage.Contract.BalanceOf(&_Storage.CallOpts, owner)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address owner) view returns(uint256)
func (_Storage *StorageCallerSession) BalanceOf(owner common.Address) (*big.Int, error) {
	return _Storage.Contract.BalanceOf(&_Storage.CallOpts, owner)
}

// GetApproved is a free data retrieval call binding the contract method 0x081812fc.
//
// Solidity: function getApproved(uint256 ) view returns(address)
func (_Storage *StorageCaller) GetApproved(opts *bind.CallOpts, arg0 *big.Int) (common.Address, error) {
	var out []interface{}
	err := _Storage.contract.Call(opts, &out, "getApproved", arg0)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetApproved is a free data retrieval call binding the contract method 0x081812fc.
//
// Solidity: function getApproved(uint256 ) view returns(address)
func (_Storage *StorageSession) GetApproved(arg0 *big.Int) (common.Address, error) {
	return _Storage.Contract.GetApproved(&_Storage.CallOpts, arg0)
}

// GetApproved is a free data retrieval call binding the contract method 0x081812fc.
//
// Solidity: function getApproved(uint256 ) view returns(address)
func (_Storage *StorageCallerSession) GetApproved(arg0 *big.Int) (common.Address, error) {
	return _Storage.Contract.GetApproved(&_Storage.CallOpts, arg0)
}

// IsApprovedForAll is a free data retrieval call binding the contract method 0xe985e9c5.
//
// Solidity: function isApprovedForAll(address , address ) view returns(bool)
func (_Storage *StorageCaller) IsApprovedForAll(opts *bind.CallOpts, arg0 common.Address, arg1 common.Address) (bool, error) {
	var out []interface{}
	err := _Storage.contract.Call(opts, &out, "isApprovedForAll", arg0, arg1)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsApprovedForAll is a free data retrieval call binding the contract method 0xe985e9c5.
//
// Solidity: function isApprovedForAll(address , address ) view returns(bool)
func (_Storage *StorageSession) IsApprovedForAll(arg0 common.Address, arg1 common.Address) (bool, error) {
	return _Storage.Contract.IsApprovedForAll(&_Storage.CallOpts, arg0, arg1)
}

// IsApprovedForAll is a free data retrieval call binding the contract method 0xe985e9c5.
//
// Solidity: function isApprovedForAll(address , address ) view returns(bool)
func (_Storage *StorageCallerSession) IsApprovedForAll(arg0 common.Address, arg1 common.Address) (bool, error) {
	return _Storage.Contract.IsApprovedForAll(&_Storage.CallOpts, arg0, arg1)
}

// Locked is a free data retrieval call binding the contract method 0xb45a3c0e.
//
// Solidity: function locked(uint256 tokenId) view returns(bool)
func (_Storage *StorageCaller) Locked(opts *bind.CallOpts, tokenId *big.Int) (bool, error) {
	var out []interface{}
	err := _Storage.contract.Call(opts, &out, "locked", tokenId)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// Locked is a free data retrieval call binding the contract method 0xb45a3c0e.
//
// Solidity: function locked(uint256 tokenId) view returns(bool)
func (_Storage *StorageSession) Locked(tokenId *big.Int) (bool, error) {
	return _Storage.Contract.Locked(&_Storage.CallOpts, tokenId)
}

// Locked is a free data retrieval call binding the contract method 0xb45a3c0e.
//
// Solidity: function locked(uint256 tokenId) view returns(bool)
func (_Storage *StorageCallerSession) Locked(tokenId *big.Int) (bool, error) {
	return _Storage.Contract.Locked(&_Storage.CallOpts, tokenId)
}

// MetadataAddr is a free data retrieval call binding the contract method 0x1275e26b.
//
// Solidity: function metadataAddr() view returns(address)
func (_Storage *StorageCaller) MetadataAddr(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _Storage.contract.Call(opts, &out, "metadataAddr")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// MetadataAddr is a free data retrieval call binding the contract method 0x1275e26b.
//
// Solidity: function metadataAddr() view returns(address)
func (_Storage *StorageSession) MetadataAddr() (common.Address, error) {
	return _Storage.Contract.MetadataAddr(&_Storage.CallOpts)
}

// MetadataAddr is a free data retrieval call binding the contract method 0x1275e26b.
//
// Solidity: function metadataAddr() view returns(address)
func (_Storage *StorageCallerSession) MetadataAddr() (common.Address, error) {
	return _Storage.Contract.MetadataAddr(&_Storage.CallOpts)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_Storage *StorageCaller) Name(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _Storage.contract.Call(opts, &out, "name")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_Storage *StorageSession) Name() (string, error) {
	return _Storage.Contract.Name(&_Storage.CallOpts)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_Storage *StorageCallerSession) Name() (string, error) {
	return _Storage.Contract.Name(&_Storage.CallOpts)
}

// Order is a free data retrieval call binding the contract method 0xbf15071d.
//
// Solidity: function order() view returns(address)
func (_Storage *StorageCaller) Order(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _Storage.contract.Call(opts, &out, "order")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Order is a free data retrieval call binding the contract method 0xbf15071d.
//
// Solidity: function order() view returns(address)
func (_Storage *StorageSession) Order() (common.Address, error) {
	return _Storage.Contract.Order(&_Storage.CallOpts)
}

// Order is a free data retrieval call binding the contract method 0xbf15071d.
//
// Solidity: function order() view returns(address)
func (_Storage *StorageCallerSession) Order() (common.Address, error) {
	return _Storage.Contract.Order(&_Storage.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_Storage *StorageCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _Storage.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_Storage *StorageSession) Owner() (common.Address, error) {
	return _Storage.Contract.Owner(&_Storage.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_Storage *StorageCallerSession) Owner() (common.Address, error) {
	return _Storage.Contract.Owner(&_Storage.CallOpts)
}

// OwnerOf is a free data retrieval call binding the contract method 0x6352211e.
//
// Solidity: function ownerOf(uint256 tokenId) view returns(address)
func (_Storage *StorageCaller) OwnerOf(opts *bind.CallOpts, tokenId *big.Int) (common.Address, error) {
	var out []interface{}
	err := _Storage.contract.Call(opts, &out, "ownerOf", tokenId)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// OwnerOf is a free data retrieval call binding the contract method 0x6352211e.
//
// Solidity: function ownerOf(uint256 tokenId) view returns(address)
func (_Storage *StorageSession) OwnerOf(tokenId *big.Int) (common.Address, error) {
	return _Storage.Contract.OwnerOf(&_Storage.CallOpts, tokenId)
}

// OwnerOf is a free data retrieval call binding the contract method 0x6352211e.
//
// Solidity: function ownerOf(uint256 tokenId) view returns(address)
func (_Storage *StorageCallerSession) OwnerOf(tokenId *big.Int) (common.Address, error) {
	return _Storage.Contract.OwnerOf(&_Storage.CallOpts, tokenId)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_Storage *StorageCaller) SupportsInterface(opts *bind.CallOpts, interfaceId [4]byte) (bool, error) {
	var out []interface{}
	err := _Storage.contract.Call(opts, &out, "supportsInterface", interfaceId)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_Storage *StorageSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _Storage.Contract.SupportsInterface(&_Storage.CallOpts, interfaceId)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_Storage *StorageCallerSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _Storage.Contract.SupportsInterface(&_Storage.CallOpts, interfaceId)
}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_Storage *StorageCaller) Symbol(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _Storage.contract.Call(opts, &out, "symbol")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_Storage *StorageSession) Symbol() (string, error) {
	return _Storage.Contract.Symbol(&_Storage.CallOpts)
}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_Storage *StorageCallerSession) Symbol() (string, error) {
	return _Storage.Contract.Symbol(&_Storage.CallOpts)
}

// Tasks is a free data retrieval call binding the contract method 0x8d977672.
//
// Solidity: function tasks(uint256 ) view returns(string title, string desc, string attachment, uint8 currency, uint112 budget, uint32 period, uint48 skills, bool disabled)
func (_Storage *StorageCaller) Tasks(opts *bind.CallOpts, arg0 *big.Int) (struct {
	Title      string
	Desc       string
	Attachment string
	Currency   uint8
	Budget     *big.Int
	Period     uint32
	Skills     *big.Int
	Disabled   bool
}, error) {
	var out []interface{}
	err := _Storage.contract.Call(opts, &out, "tasks", arg0)

	outstruct := new(struct {
		Title      string
		Desc       string
		Attachment string
		Currency   uint8
		Budget     *big.Int
		Period     uint32
		Skills     *big.Int
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
	outstruct.Disabled = *abi.ConvertType(out[7], new(bool)).(*bool)

	return *outstruct, err

}

// Tasks is a free data retrieval call binding the contract method 0x8d977672.
//
// Solidity: function tasks(uint256 ) view returns(string title, string desc, string attachment, uint8 currency, uint112 budget, uint32 period, uint48 skills, bool disabled)
func (_Storage *StorageSession) Tasks(arg0 *big.Int) (struct {
	Title      string
	Desc       string
	Attachment string
	Currency   uint8
	Budget     *big.Int
	Period     uint32
	Skills     *big.Int
	Disabled   bool
}, error) {
	return _Storage.Contract.Tasks(&_Storage.CallOpts, arg0)
}

// Tasks is a free data retrieval call binding the contract method 0x8d977672.
//
// Solidity: function tasks(uint256 ) view returns(string title, string desc, string attachment, uint8 currency, uint112 budget, uint32 period, uint48 skills, bool disabled)
func (_Storage *StorageCallerSession) Tasks(arg0 *big.Int) (struct {
	Title      string
	Desc       string
	Attachment string
	Currency   uint8
	Budget     *big.Int
	Period     uint32
	Skills     *big.Int
	Disabled   bool
}, error) {
	return _Storage.Contract.Tasks(&_Storage.CallOpts, arg0)
}

// TokenURI is a free data retrieval call binding the contract method 0xc87b56dd.
//
// Solidity: function tokenURI(uint256 tokenId) view returns(string)
func (_Storage *StorageCaller) TokenURI(opts *bind.CallOpts, tokenId *big.Int) (string, error) {
	var out []interface{}
	err := _Storage.contract.Call(opts, &out, "tokenURI", tokenId)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// TokenURI is a free data retrieval call binding the contract method 0xc87b56dd.
//
// Solidity: function tokenURI(uint256 tokenId) view returns(string)
func (_Storage *StorageSession) TokenURI(tokenId *big.Int) (string, error) {
	return _Storage.Contract.TokenURI(&_Storage.CallOpts, tokenId)
}

// TokenURI is a free data retrieval call binding the contract method 0xc87b56dd.
//
// Solidity: function tokenURI(uint256 tokenId) view returns(string)
func (_Storage *StorageCallerSession) TokenURI(tokenId *big.Int) (string, error) {
	return _Storage.Contract.TokenURI(&_Storage.CallOpts, tokenId)
}

// ApplyAndCancel is a paid mutator transaction binding the contract method 0x6a926691.
//
// Solidity: function applyAndCancel(address who, uint256[] _taskIds, uint256[] costs, uint256[] cancelIds) payable returns()
func (_Storage *StorageTransactor) ApplyAndCancel(opts *bind.TransactOpts, who common.Address, _taskIds []*big.Int, costs []*big.Int, cancelIds []*big.Int) (*types.Transaction, error) {
	return _Storage.contract.Transact(opts, "applyAndCancel", who, _taskIds, costs, cancelIds)
}

// ApplyAndCancel is a paid mutator transaction binding the contract method 0x6a926691.
//
// Solidity: function applyAndCancel(address who, uint256[] _taskIds, uint256[] costs, uint256[] cancelIds) payable returns()
func (_Storage *StorageSession) ApplyAndCancel(who common.Address, _taskIds []*big.Int, costs []*big.Int, cancelIds []*big.Int) (*types.Transaction, error) {
	return _Storage.Contract.ApplyAndCancel(&_Storage.TransactOpts, who, _taskIds, costs, cancelIds)
}

// ApplyAndCancel is a paid mutator transaction binding the contract method 0x6a926691.
//
// Solidity: function applyAndCancel(address who, uint256[] _taskIds, uint256[] costs, uint256[] cancelIds) payable returns()
func (_Storage *StorageTransactorSession) ApplyAndCancel(who common.Address, _taskIds []*big.Int, costs []*big.Int, cancelIds []*big.Int) (*types.Transaction, error) {
	return _Storage.Contract.ApplyAndCancel(&_Storage.TransactOpts, who, _taskIds, costs, cancelIds)
}

// ApplyFor is a paid mutator transaction binding the contract method 0x76a41a02.
//
// Solidity: function applyFor(address who, uint256 taskId, uint256 _cost) payable returns()
func (_Storage *StorageTransactor) ApplyFor(opts *bind.TransactOpts, who common.Address, taskId *big.Int, _cost *big.Int) (*types.Transaction, error) {
	return _Storage.contract.Transact(opts, "applyFor", who, taskId, _cost)
}

// ApplyFor is a paid mutator transaction binding the contract method 0x76a41a02.
//
// Solidity: function applyFor(address who, uint256 taskId, uint256 _cost) payable returns()
func (_Storage *StorageSession) ApplyFor(who common.Address, taskId *big.Int, _cost *big.Int) (*types.Transaction, error) {
	return _Storage.Contract.ApplyFor(&_Storage.TransactOpts, who, taskId, _cost)
}

// ApplyFor is a paid mutator transaction binding the contract method 0x76a41a02.
//
// Solidity: function applyFor(address who, uint256 taskId, uint256 _cost) payable returns()
func (_Storage *StorageTransactorSession) ApplyFor(who common.Address, taskId *big.Int, _cost *big.Int) (*types.Transaction, error) {
	return _Storage.Contract.ApplyFor(&_Storage.TransactOpts, who, taskId, _cost)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address , uint256 ) returns()
func (_Storage *StorageTransactor) Approve(opts *bind.TransactOpts, arg0 common.Address, arg1 *big.Int) (*types.Transaction, error) {
	return _Storage.contract.Transact(opts, "approve", arg0, arg1)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address , uint256 ) returns()
func (_Storage *StorageSession) Approve(arg0 common.Address, arg1 *big.Int) (*types.Transaction, error) {
	return _Storage.Contract.Approve(&_Storage.TransactOpts, arg0, arg1)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address , uint256 ) returns()
func (_Storage *StorageTransactorSession) Approve(arg0 common.Address, arg1 *big.Int) (*types.Transaction, error) {
	return _Storage.Contract.Approve(&_Storage.TransactOpts, arg0, arg1)
}

// CancelApply is a paid mutator transaction binding the contract method 0xd4fa6d1f.
//
// Solidity: function cancelApply(uint256 taskId) returns()
func (_Storage *StorageTransactor) CancelApply(opts *bind.TransactOpts, taskId *big.Int) (*types.Transaction, error) {
	return _Storage.contract.Transact(opts, "cancelApply", taskId)
}

// CancelApply is a paid mutator transaction binding the contract method 0xd4fa6d1f.
//
// Solidity: function cancelApply(uint256 taskId) returns()
func (_Storage *StorageSession) CancelApply(taskId *big.Int) (*types.Transaction, error) {
	return _Storage.Contract.CancelApply(&_Storage.TransactOpts, taskId)
}

// CancelApply is a paid mutator transaction binding the contract method 0xd4fa6d1f.
//
// Solidity: function cancelApply(uint256 taskId) returns()
func (_Storage *StorageTransactorSession) CancelApply(taskId *big.Int) (*types.Transaction, error) {
	return _Storage.Contract.CancelApply(&_Storage.TransactOpts, taskId)
}

// CreateTask is a paid mutator transaction binding the contract method 0xf98e2746.
//
// Solidity: function createTask(address who, (string,string,string,uint8,uint112,uint32,uint48,bool) task) payable returns()
func (_Storage *StorageTransactor) CreateTask(opts *bind.TransactOpts, who common.Address, task TaskInfo) (*types.Transaction, error) {
	return _Storage.contract.Transact(opts, "createTask", who, task)
}

// CreateTask is a paid mutator transaction binding the contract method 0xf98e2746.
//
// Solidity: function createTask(address who, (string,string,string,uint8,uint112,uint32,uint48,bool) task) payable returns()
func (_Storage *StorageSession) CreateTask(who common.Address, task TaskInfo) (*types.Transaction, error) {
	return _Storage.Contract.CreateTask(&_Storage.TransactOpts, who, task)
}

// CreateTask is a paid mutator transaction binding the contract method 0xf98e2746.
//
// Solidity: function createTask(address who, (string,string,string,uint8,uint112,uint32,uint48,bool) task) payable returns()
func (_Storage *StorageTransactorSession) CreateTask(who common.Address, task TaskInfo) (*types.Transaction, error) {
	return _Storage.Contract.CreateTask(&_Storage.TransactOpts, who, task)
}

// DisableTask is a paid mutator transaction binding the contract method 0x80c33004.
//
// Solidity: function disableTask(uint256 taskId, bool _disabled) returns()
func (_Storage *StorageTransactor) DisableTask(opts *bind.TransactOpts, taskId *big.Int, _disabled bool) (*types.Transaction, error) {
	return _Storage.contract.Transact(opts, "disableTask", taskId, _disabled)
}

// DisableTask is a paid mutator transaction binding the contract method 0x80c33004.
//
// Solidity: function disableTask(uint256 taskId, bool _disabled) returns()
func (_Storage *StorageSession) DisableTask(taskId *big.Int, _disabled bool) (*types.Transaction, error) {
	return _Storage.Contract.DisableTask(&_Storage.TransactOpts, taskId, _disabled)
}

// DisableTask is a paid mutator transaction binding the contract method 0x80c33004.
//
// Solidity: function disableTask(uint256 taskId, bool _disabled) returns()
func (_Storage *StorageTransactorSession) DisableTask(taskId *big.Int, _disabled bool) (*types.Transaction, error) {
	return _Storage.Contract.DisableTask(&_Storage.TransactOpts, taskId, _disabled)
}

// ModifyTask is a paid mutator transaction binding the contract method 0x85a0957e.
//
// Solidity: function modifyTask(uint256 taskId, (string,string,string,uint8,uint112,uint32,uint48,bool) task) payable returns()
func (_Storage *StorageTransactor) ModifyTask(opts *bind.TransactOpts, taskId *big.Int, task TaskInfo) (*types.Transaction, error) {
	return _Storage.contract.Transact(opts, "modifyTask", taskId, task)
}

// ModifyTask is a paid mutator transaction binding the contract method 0x85a0957e.
//
// Solidity: function modifyTask(uint256 taskId, (string,string,string,uint8,uint112,uint32,uint48,bool) task) payable returns()
func (_Storage *StorageSession) ModifyTask(taskId *big.Int, task TaskInfo) (*types.Transaction, error) {
	return _Storage.Contract.ModifyTask(&_Storage.TransactOpts, taskId, task)
}

// ModifyTask is a paid mutator transaction binding the contract method 0x85a0957e.
//
// Solidity: function modifyTask(uint256 taskId, (string,string,string,uint8,uint112,uint32,uint48,bool) task) payable returns()
func (_Storage *StorageTransactorSession) ModifyTask(taskId *big.Int, task TaskInfo) (*types.Transaction, error) {
	return _Storage.Contract.ModifyTask(&_Storage.TransactOpts, taskId, task)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Storage *StorageTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Storage.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Storage *StorageSession) RenounceOwnership() (*types.Transaction, error) {
	return _Storage.Contract.RenounceOwnership(&_Storage.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Storage *StorageTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _Storage.Contract.RenounceOwnership(&_Storage.TransactOpts)
}

// SafeTransferFrom is a paid mutator transaction binding the contract method 0x42842e0e.
//
// Solidity: function safeTransferFrom(address , address , uint256 ) returns()
func (_Storage *StorageTransactor) SafeTransferFrom(opts *bind.TransactOpts, arg0 common.Address, arg1 common.Address, arg2 *big.Int) (*types.Transaction, error) {
	return _Storage.contract.Transact(opts, "safeTransferFrom", arg0, arg1, arg2)
}

// SafeTransferFrom is a paid mutator transaction binding the contract method 0x42842e0e.
//
// Solidity: function safeTransferFrom(address , address , uint256 ) returns()
func (_Storage *StorageSession) SafeTransferFrom(arg0 common.Address, arg1 common.Address, arg2 *big.Int) (*types.Transaction, error) {
	return _Storage.Contract.SafeTransferFrom(&_Storage.TransactOpts, arg0, arg1, arg2)
}

// SafeTransferFrom is a paid mutator transaction binding the contract method 0x42842e0e.
//
// Solidity: function safeTransferFrom(address , address , uint256 ) returns()
func (_Storage *StorageTransactorSession) SafeTransferFrom(arg0 common.Address, arg1 common.Address, arg2 *big.Int) (*types.Transaction, error) {
	return _Storage.Contract.SafeTransferFrom(&_Storage.TransactOpts, arg0, arg1, arg2)
}

// SafeTransferFrom0 is a paid mutator transaction binding the contract method 0xb88d4fde.
//
// Solidity: function safeTransferFrom(address , address , uint256 , bytes ) returns()
func (_Storage *StorageTransactor) SafeTransferFrom0(opts *bind.TransactOpts, arg0 common.Address, arg1 common.Address, arg2 *big.Int, arg3 []byte) (*types.Transaction, error) {
	return _Storage.contract.Transact(opts, "safeTransferFrom0", arg0, arg1, arg2, arg3)
}

// SafeTransferFrom0 is a paid mutator transaction binding the contract method 0xb88d4fde.
//
// Solidity: function safeTransferFrom(address , address , uint256 , bytes ) returns()
func (_Storage *StorageSession) SafeTransferFrom0(arg0 common.Address, arg1 common.Address, arg2 *big.Int, arg3 []byte) (*types.Transaction, error) {
	return _Storage.Contract.SafeTransferFrom0(&_Storage.TransactOpts, arg0, arg1, arg2, arg3)
}

// SafeTransferFrom0 is a paid mutator transaction binding the contract method 0xb88d4fde.
//
// Solidity: function safeTransferFrom(address , address , uint256 , bytes ) returns()
func (_Storage *StorageTransactorSession) SafeTransferFrom0(arg0 common.Address, arg1 common.Address, arg2 *big.Int, arg3 []byte) (*types.Transaction, error) {
	return _Storage.Contract.SafeTransferFrom0(&_Storage.TransactOpts, arg0, arg1, arg2, arg3)
}

// SetApprovalForAll is a paid mutator transaction binding the contract method 0xa22cb465.
//
// Solidity: function setApprovalForAll(address , bool ) returns()
func (_Storage *StorageTransactor) SetApprovalForAll(opts *bind.TransactOpts, arg0 common.Address, arg1 bool) (*types.Transaction, error) {
	return _Storage.contract.Transact(opts, "setApprovalForAll", arg0, arg1)
}

// SetApprovalForAll is a paid mutator transaction binding the contract method 0xa22cb465.
//
// Solidity: function setApprovalForAll(address , bool ) returns()
func (_Storage *StorageSession) SetApprovalForAll(arg0 common.Address, arg1 bool) (*types.Transaction, error) {
	return _Storage.Contract.SetApprovalForAll(&_Storage.TransactOpts, arg0, arg1)
}

// SetApprovalForAll is a paid mutator transaction binding the contract method 0xa22cb465.
//
// Solidity: function setApprovalForAll(address , bool ) returns()
func (_Storage *StorageTransactorSession) SetApprovalForAll(arg0 common.Address, arg1 bool) (*types.Transaction, error) {
	return _Storage.Contract.SetApprovalForAll(&_Storage.TransactOpts, arg0, arg1)
}

// SetMetadataContract is a paid mutator transaction binding the contract method 0xe5187f43.
//
// Solidity: function setMetadataContract(address _meta) returns()
func (_Storage *StorageTransactor) SetMetadataContract(opts *bind.TransactOpts, _meta common.Address) (*types.Transaction, error) {
	return _Storage.contract.Transact(opts, "setMetadataContract", _meta)
}

// SetMetadataContract is a paid mutator transaction binding the contract method 0xe5187f43.
//
// Solidity: function setMetadataContract(address _meta) returns()
func (_Storage *StorageSession) SetMetadataContract(_meta common.Address) (*types.Transaction, error) {
	return _Storage.Contract.SetMetadataContract(&_Storage.TransactOpts, _meta)
}

// SetMetadataContract is a paid mutator transaction binding the contract method 0xe5187f43.
//
// Solidity: function setMetadataContract(address _meta) returns()
func (_Storage *StorageTransactorSession) SetMetadataContract(_meta common.Address) (*types.Transaction, error) {
	return _Storage.Contract.SetMetadataContract(&_Storage.TransactOpts, _meta)
}

// SetOrder is a paid mutator transaction binding the contract method 0x0e5b34be.
//
// Solidity: function setOrder(address _order) returns()
func (_Storage *StorageTransactor) SetOrder(opts *bind.TransactOpts, _order common.Address) (*types.Transaction, error) {
	return _Storage.contract.Transact(opts, "setOrder", _order)
}

// SetOrder is a paid mutator transaction binding the contract method 0x0e5b34be.
//
// Solidity: function setOrder(address _order) returns()
func (_Storage *StorageSession) SetOrder(_order common.Address) (*types.Transaction, error) {
	return _Storage.Contract.SetOrder(&_Storage.TransactOpts, _order)
}

// SetOrder is a paid mutator transaction binding the contract method 0x0e5b34be.
//
// Solidity: function setOrder(address _order) returns()
func (_Storage *StorageTransactorSession) SetOrder(_order common.Address) (*types.Transaction, error) {
	return _Storage.Contract.SetOrder(&_Storage.TransactOpts, _order)
}

// TransferFee is a paid mutator transaction binding the contract method 0xd4203561.
//
// Solidity: function transferFee(uint256 amount) returns()
func (_Storage *StorageTransactor) TransferFee(opts *bind.TransactOpts, amount *big.Int) (*types.Transaction, error) {
	return _Storage.contract.Transact(opts, "transferFee", amount)
}

// TransferFee is a paid mutator transaction binding the contract method 0xd4203561.
//
// Solidity: function transferFee(uint256 amount) returns()
func (_Storage *StorageSession) TransferFee(amount *big.Int) (*types.Transaction, error) {
	return _Storage.Contract.TransferFee(&_Storage.TransactOpts, amount)
}

// TransferFee is a paid mutator transaction binding the contract method 0xd4203561.
//
// Solidity: function transferFee(uint256 amount) returns()
func (_Storage *StorageTransactorSession) TransferFee(amount *big.Int) (*types.Transaction, error) {
	return _Storage.Contract.TransferFee(&_Storage.TransactOpts, amount)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address , address , uint256 ) returns()
func (_Storage *StorageTransactor) TransferFrom(opts *bind.TransactOpts, arg0 common.Address, arg1 common.Address, arg2 *big.Int) (*types.Transaction, error) {
	return _Storage.contract.Transact(opts, "transferFrom", arg0, arg1, arg2)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address , address , uint256 ) returns()
func (_Storage *StorageSession) TransferFrom(arg0 common.Address, arg1 common.Address, arg2 *big.Int) (*types.Transaction, error) {
	return _Storage.Contract.TransferFrom(&_Storage.TransactOpts, arg0, arg1, arg2)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address , address , uint256 ) returns()
func (_Storage *StorageTransactorSession) TransferFrom(arg0 common.Address, arg1 common.Address, arg2 *big.Int) (*types.Transaction, error) {
	return _Storage.Contract.TransferFrom(&_Storage.TransactOpts, arg0, arg1, arg2)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_Storage *StorageTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _Storage.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_Storage *StorageSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _Storage.Contract.TransferOwnership(&_Storage.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_Storage *StorageTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _Storage.Contract.TransferOwnership(&_Storage.TransactOpts, newOwner)
}

// UpdateFeeReceiver is a paid mutator transaction binding the contract method 0x90c2c656.
//
// Solidity: function updateFeeReceiver(uint256 _taskFee, uint256 _applyFee, address _receiver) returns()
func (_Storage *StorageTransactor) UpdateFeeReceiver(opts *bind.TransactOpts, _taskFee *big.Int, _applyFee *big.Int, _receiver common.Address) (*types.Transaction, error) {
	return _Storage.contract.Transact(opts, "updateFeeReceiver", _taskFee, _applyFee, _receiver)
}

// UpdateFeeReceiver is a paid mutator transaction binding the contract method 0x90c2c656.
//
// Solidity: function updateFeeReceiver(uint256 _taskFee, uint256 _applyFee, address _receiver) returns()
func (_Storage *StorageSession) UpdateFeeReceiver(_taskFee *big.Int, _applyFee *big.Int, _receiver common.Address) (*types.Transaction, error) {
	return _Storage.Contract.UpdateFeeReceiver(&_Storage.TransactOpts, _taskFee, _applyFee, _receiver)
}

// UpdateFeeReceiver is a paid mutator transaction binding the contract method 0x90c2c656.
//
// Solidity: function updateFeeReceiver(uint256 _taskFee, uint256 _applyFee, address _receiver) returns()
func (_Storage *StorageTransactorSession) UpdateFeeReceiver(_taskFee *big.Int, _applyFee *big.Int, _receiver common.Address) (*types.Transaction, error) {
	return _Storage.Contract.UpdateFeeReceiver(&_Storage.TransactOpts, _taskFee, _applyFee, _receiver)
}

// StorageApplyForIterator is returned from FilterApplyFor and is used to iterate over the raw logs and unpacked data for ApplyFor events raised by the Storage contract.
type StorageApplyForIterator struct {
	Event *StorageApplyFor // Event containing the contract specifics and raw log

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
func (it *StorageApplyForIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StorageApplyFor)
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
		it.Event = new(StorageApplyFor)
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
func (it *StorageApplyForIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StorageApplyForIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StorageApplyFor represents a ApplyFor event raised by the Storage contract.
type StorageApplyFor struct {
	TaskId *big.Int
	Worker common.Address
	Cost   *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterApplyFor is a free log retrieval operation binding the contract event 0x4c9756716032f5f6730d78679ef0dd08e2b329301f77880e23fa8cab0a150657.
//
// Solidity: event ApplyFor(uint256 indexed taskId, address indexed worker, uint256 cost)
func (_Storage *StorageFilterer) FilterApplyFor(opts *bind.FilterOpts, taskId []*big.Int, worker []common.Address) (*StorageApplyForIterator, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}
	var workerRule []interface{}
	for _, workerItem := range worker {
		workerRule = append(workerRule, workerItem)
	}

	logs, sub, err := _Storage.contract.FilterLogs(opts, "ApplyFor", taskIdRule, workerRule)
	if err != nil {
		return nil, err
	}
	return &StorageApplyForIterator{contract: _Storage.contract, event: "ApplyFor", logs: logs, sub: sub}, nil
}

// WatchApplyFor is a free log subscription operation binding the contract event 0x4c9756716032f5f6730d78679ef0dd08e2b329301f77880e23fa8cab0a150657.
//
// Solidity: event ApplyFor(uint256 indexed taskId, address indexed worker, uint256 cost)
func (_Storage *StorageFilterer) WatchApplyFor(opts *bind.WatchOpts, sink chan<- *StorageApplyFor, taskId []*big.Int, worker []common.Address) (event.Subscription, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}
	var workerRule []interface{}
	for _, workerItem := range worker {
		workerRule = append(workerRule, workerItem)
	}

	logs, sub, err := _Storage.contract.WatchLogs(opts, "ApplyFor", taskIdRule, workerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StorageApplyFor)
				if err := _Storage.contract.UnpackLog(event, "ApplyFor", log); err != nil {
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
func (_Storage *StorageFilterer) ParseApplyFor(log types.Log) (*StorageApplyFor, error) {
	event := new(StorageApplyFor)
	if err := _Storage.contract.UnpackLog(event, "ApplyFor", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// StorageApprovalIterator is returned from FilterApproval and is used to iterate over the raw logs and unpacked data for Approval events raised by the Storage contract.
type StorageApprovalIterator struct {
	Event *StorageApproval // Event containing the contract specifics and raw log

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
func (it *StorageApprovalIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StorageApproval)
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
		it.Event = new(StorageApproval)
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
func (it *StorageApprovalIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StorageApprovalIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StorageApproval represents a Approval event raised by the Storage contract.
type StorageApproval struct {
	Owner    common.Address
	Approved common.Address
	TokenId  *big.Int
	Raw      types.Log // Blockchain specific contextual infos
}

// FilterApproval is a free log retrieval operation binding the contract event 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925.
//
// Solidity: event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)
func (_Storage *StorageFilterer) FilterApproval(opts *bind.FilterOpts, owner []common.Address, approved []common.Address, tokenId []*big.Int) (*StorageApprovalIterator, error) {

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

	logs, sub, err := _Storage.contract.FilterLogs(opts, "Approval", ownerRule, approvedRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &StorageApprovalIterator{contract: _Storage.contract, event: "Approval", logs: logs, sub: sub}, nil
}

// WatchApproval is a free log subscription operation binding the contract event 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925.
//
// Solidity: event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)
func (_Storage *StorageFilterer) WatchApproval(opts *bind.WatchOpts, sink chan<- *StorageApproval, owner []common.Address, approved []common.Address, tokenId []*big.Int) (event.Subscription, error) {

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

	logs, sub, err := _Storage.contract.WatchLogs(opts, "Approval", ownerRule, approvedRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StorageApproval)
				if err := _Storage.contract.UnpackLog(event, "Approval", log); err != nil {
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
func (_Storage *StorageFilterer) ParseApproval(log types.Log) (*StorageApproval, error) {
	event := new(StorageApproval)
	if err := _Storage.contract.UnpackLog(event, "Approval", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// StorageApprovalForAllIterator is returned from FilterApprovalForAll and is used to iterate over the raw logs and unpacked data for ApprovalForAll events raised by the Storage contract.
type StorageApprovalForAllIterator struct {
	Event *StorageApprovalForAll // Event containing the contract specifics and raw log

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
func (it *StorageApprovalForAllIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StorageApprovalForAll)
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
		it.Event = new(StorageApprovalForAll)
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
func (it *StorageApprovalForAllIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StorageApprovalForAllIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StorageApprovalForAll represents a ApprovalForAll event raised by the Storage contract.
type StorageApprovalForAll struct {
	Owner    common.Address
	Operator common.Address
	Approved bool
	Raw      types.Log // Blockchain specific contextual infos
}

// FilterApprovalForAll is a free log retrieval operation binding the contract event 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31.
//
// Solidity: event ApprovalForAll(address indexed owner, address indexed operator, bool approved)
func (_Storage *StorageFilterer) FilterApprovalForAll(opts *bind.FilterOpts, owner []common.Address, operator []common.Address) (*StorageApprovalForAllIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}

	logs, sub, err := _Storage.contract.FilterLogs(opts, "ApprovalForAll", ownerRule, operatorRule)
	if err != nil {
		return nil, err
	}
	return &StorageApprovalForAllIterator{contract: _Storage.contract, event: "ApprovalForAll", logs: logs, sub: sub}, nil
}

// WatchApprovalForAll is a free log subscription operation binding the contract event 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31.
//
// Solidity: event ApprovalForAll(address indexed owner, address indexed operator, bool approved)
func (_Storage *StorageFilterer) WatchApprovalForAll(opts *bind.WatchOpts, sink chan<- *StorageApprovalForAll, owner []common.Address, operator []common.Address) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}

	logs, sub, err := _Storage.contract.WatchLogs(opts, "ApprovalForAll", ownerRule, operatorRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StorageApprovalForAll)
				if err := _Storage.contract.UnpackLog(event, "ApprovalForAll", log); err != nil {
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
func (_Storage *StorageFilterer) ParseApprovalForAll(log types.Log) (*StorageApprovalForAll, error) {
	event := new(StorageApprovalForAll)
	if err := _Storage.contract.UnpackLog(event, "ApprovalForAll", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// StorageCancelApplyIterator is returned from FilterCancelApply and is used to iterate over the raw logs and unpacked data for CancelApply events raised by the Storage contract.
type StorageCancelApplyIterator struct {
	Event *StorageCancelApply // Event containing the contract specifics and raw log

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
func (it *StorageCancelApplyIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StorageCancelApply)
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
		it.Event = new(StorageCancelApply)
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
func (it *StorageCancelApplyIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StorageCancelApplyIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StorageCancelApply represents a CancelApply event raised by the Storage contract.
type StorageCancelApply struct {
	TaskId *big.Int
	Worker common.Address
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterCancelApply is a free log retrieval operation binding the contract event 0x32fb6e8d2f978f5b7e04d03ad7b3605ca4f45d67d9979bfc34aba61809bee139.
//
// Solidity: event CancelApply(uint256 indexed taskId, address worker)
func (_Storage *StorageFilterer) FilterCancelApply(opts *bind.FilterOpts, taskId []*big.Int) (*StorageCancelApplyIterator, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _Storage.contract.FilterLogs(opts, "CancelApply", taskIdRule)
	if err != nil {
		return nil, err
	}
	return &StorageCancelApplyIterator{contract: _Storage.contract, event: "CancelApply", logs: logs, sub: sub}, nil
}

// WatchCancelApply is a free log subscription operation binding the contract event 0x32fb6e8d2f978f5b7e04d03ad7b3605ca4f45d67d9979bfc34aba61809bee139.
//
// Solidity: event CancelApply(uint256 indexed taskId, address worker)
func (_Storage *StorageFilterer) WatchCancelApply(opts *bind.WatchOpts, sink chan<- *StorageCancelApply, taskId []*big.Int) (event.Subscription, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _Storage.contract.WatchLogs(opts, "CancelApply", taskIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StorageCancelApply)
				if err := _Storage.contract.UnpackLog(event, "CancelApply", log); err != nil {
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
func (_Storage *StorageFilterer) ParseCancelApply(log types.Log) (*StorageCancelApply, error) {
	event := new(StorageCancelApply)
	if err := _Storage.contract.UnpackLog(event, "CancelApply", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// StorageLockedIterator is returned from FilterLocked and is used to iterate over the raw logs and unpacked data for Locked events raised by the Storage contract.
type StorageLockedIterator struct {
	Event *StorageLocked // Event containing the contract specifics and raw log

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
func (it *StorageLockedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StorageLocked)
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
		it.Event = new(StorageLocked)
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
func (it *StorageLockedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StorageLockedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StorageLocked represents a Locked event raised by the Storage contract.
type StorageLocked struct {
	TokenId *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterLocked is a free log retrieval operation binding the contract event 0x032bc66be43dbccb7487781d168eb7bda224628a3b2c3388bdf69b532a3a1611.
//
// Solidity: event Locked(uint256 tokenId)
func (_Storage *StorageFilterer) FilterLocked(opts *bind.FilterOpts) (*StorageLockedIterator, error) {

	logs, sub, err := _Storage.contract.FilterLogs(opts, "Locked")
	if err != nil {
		return nil, err
	}
	return &StorageLockedIterator{contract: _Storage.contract, event: "Locked", logs: logs, sub: sub}, nil
}

// WatchLocked is a free log subscription operation binding the contract event 0x032bc66be43dbccb7487781d168eb7bda224628a3b2c3388bdf69b532a3a1611.
//
// Solidity: event Locked(uint256 tokenId)
func (_Storage *StorageFilterer) WatchLocked(opts *bind.WatchOpts, sink chan<- *StorageLocked) (event.Subscription, error) {

	logs, sub, err := _Storage.contract.WatchLogs(opts, "Locked")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StorageLocked)
				if err := _Storage.contract.UnpackLog(event, "Locked", log); err != nil {
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
func (_Storage *StorageFilterer) ParseLocked(log types.Log) (*StorageLocked, error) {
	event := new(StorageLocked)
	if err := _Storage.contract.UnpackLog(event, "Locked", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// StorageModifyFeeIterator is returned from FilterModifyFee and is used to iterate over the raw logs and unpacked data for ModifyFee events raised by the Storage contract.
type StorageModifyFeeIterator struct {
	Event *StorageModifyFee // Event containing the contract specifics and raw log

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
func (it *StorageModifyFeeIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StorageModifyFee)
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
		it.Event = new(StorageModifyFee)
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
func (it *StorageModifyFeeIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StorageModifyFeeIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StorageModifyFee represents a ModifyFee event raised by the Storage contract.
type StorageModifyFee struct {
	TaskFee     *big.Int
	ApplyFee    *big.Int
	FeeReceiver common.Address
	Raw         types.Log // Blockchain specific contextual infos
}

// FilterModifyFee is a free log retrieval operation binding the contract event 0x94e1b2663ea089789c2074478048dd52933747a07fe15f1fa6174fee6ee4d72c.
//
// Solidity: event ModifyFee(uint256 taskFee, uint256 applyFee, address feeReceiver)
func (_Storage *StorageFilterer) FilterModifyFee(opts *bind.FilterOpts) (*StorageModifyFeeIterator, error) {

	logs, sub, err := _Storage.contract.FilterLogs(opts, "ModifyFee")
	if err != nil {
		return nil, err
	}
	return &StorageModifyFeeIterator{contract: _Storage.contract, event: "ModifyFee", logs: logs, sub: sub}, nil
}

// WatchModifyFee is a free log subscription operation binding the contract event 0x94e1b2663ea089789c2074478048dd52933747a07fe15f1fa6174fee6ee4d72c.
//
// Solidity: event ModifyFee(uint256 taskFee, uint256 applyFee, address feeReceiver)
func (_Storage *StorageFilterer) WatchModifyFee(opts *bind.WatchOpts, sink chan<- *StorageModifyFee) (event.Subscription, error) {

	logs, sub, err := _Storage.contract.WatchLogs(opts, "ModifyFee")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StorageModifyFee)
				if err := _Storage.contract.UnpackLog(event, "ModifyFee", log); err != nil {
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
func (_Storage *StorageFilterer) ParseModifyFee(log types.Log) (*StorageModifyFee, error) {
	event := new(StorageModifyFee)
	if err := _Storage.contract.UnpackLog(event, "ModifyFee", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// StorageOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the Storage contract.
type StorageOwnershipTransferredIterator struct {
	Event *StorageOwnershipTransferred // Event containing the contract specifics and raw log

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
func (it *StorageOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StorageOwnershipTransferred)
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
		it.Event = new(StorageOwnershipTransferred)
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
func (it *StorageOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StorageOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StorageOwnershipTransferred represents a OwnershipTransferred event raised by the Storage contract.
type StorageOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Storage *StorageFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*StorageOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _Storage.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &StorageOwnershipTransferredIterator{contract: _Storage.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Storage *StorageFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *StorageOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _Storage.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StorageOwnershipTransferred)
				if err := _Storage.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
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
func (_Storage *StorageFilterer) ParseOwnershipTransferred(log types.Log) (*StorageOwnershipTransferred, error) {
	event := new(StorageOwnershipTransferred)
	if err := _Storage.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// StorageTaskCreatedIterator is returned from FilterTaskCreated and is used to iterate over the raw logs and unpacked data for TaskCreated events raised by the Storage contract.
type StorageTaskCreatedIterator struct {
	Event *StorageTaskCreated // Event containing the contract specifics and raw log

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
func (it *StorageTaskCreatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StorageTaskCreated)
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
		it.Event = new(StorageTaskCreated)
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
func (it *StorageTaskCreatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StorageTaskCreatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StorageTaskCreated represents a TaskCreated event raised by the Storage contract.
type StorageTaskCreated struct {
	TaskId *big.Int
	Issuer common.Address
	Task   TaskInfo
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterTaskCreated is a free log retrieval operation binding the contract event 0xd8360f0cdb1cec5c8584cfa3130b0ea128658503f60bfbb817d72f05d9011357.
//
// Solidity: event TaskCreated(uint256 indexed taskId, address issuer, (string,string,string,uint8,uint112,uint32,uint48,bool) task)
func (_Storage *StorageFilterer) FilterTaskCreated(opts *bind.FilterOpts, taskId []*big.Int) (*StorageTaskCreatedIterator, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _Storage.contract.FilterLogs(opts, "TaskCreated", taskIdRule)
	if err != nil {
		return nil, err
	}
	return &StorageTaskCreatedIterator{contract: _Storage.contract, event: "TaskCreated", logs: logs, sub: sub}, nil
}

// WatchTaskCreated is a free log subscription operation binding the contract event 0xd8360f0cdb1cec5c8584cfa3130b0ea128658503f60bfbb817d72f05d9011357.
//
// Solidity: event TaskCreated(uint256 indexed taskId, address issuer, (string,string,string,uint8,uint112,uint32,uint48,bool) task)
func (_Storage *StorageFilterer) WatchTaskCreated(opts *bind.WatchOpts, sink chan<- *StorageTaskCreated, taskId []*big.Int) (event.Subscription, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _Storage.contract.WatchLogs(opts, "TaskCreated", taskIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StorageTaskCreated)
				if err := _Storage.contract.UnpackLog(event, "TaskCreated", log); err != nil {
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

// ParseTaskCreated is a log parse operation binding the contract event 0xd8360f0cdb1cec5c8584cfa3130b0ea128658503f60bfbb817d72f05d9011357.
//
// Solidity: event TaskCreated(uint256 indexed taskId, address issuer, (string,string,string,uint8,uint112,uint32,uint48,bool) task)
func (_Storage *StorageFilterer) ParseTaskCreated(log types.Log) (*StorageTaskCreated, error) {
	event := new(StorageTaskCreated)
	if err := _Storage.contract.UnpackLog(event, "TaskCreated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// StorageTaskDisabledIterator is returned from FilterTaskDisabled and is used to iterate over the raw logs and unpacked data for TaskDisabled events raised by the Storage contract.
type StorageTaskDisabledIterator struct {
	Event *StorageTaskDisabled // Event containing the contract specifics and raw log

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
func (it *StorageTaskDisabledIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StorageTaskDisabled)
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
		it.Event = new(StorageTaskDisabled)
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
func (it *StorageTaskDisabledIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StorageTaskDisabledIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StorageTaskDisabled represents a TaskDisabled event raised by the Storage contract.
type StorageTaskDisabled struct {
	TaskId   *big.Int
	Disabled bool
	Raw      types.Log // Blockchain specific contextual infos
}

// FilterTaskDisabled is a free log retrieval operation binding the contract event 0x10911b1a342c0346ec14d6cfc81d65d293409eca997e8911278e7d94fce45cc9.
//
// Solidity: event TaskDisabled(uint256 indexed taskId, bool disabled)
func (_Storage *StorageFilterer) FilterTaskDisabled(opts *bind.FilterOpts, taskId []*big.Int) (*StorageTaskDisabledIterator, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _Storage.contract.FilterLogs(opts, "TaskDisabled", taskIdRule)
	if err != nil {
		return nil, err
	}
	return &StorageTaskDisabledIterator{contract: _Storage.contract, event: "TaskDisabled", logs: logs, sub: sub}, nil
}

// WatchTaskDisabled is a free log subscription operation binding the contract event 0x10911b1a342c0346ec14d6cfc81d65d293409eca997e8911278e7d94fce45cc9.
//
// Solidity: event TaskDisabled(uint256 indexed taskId, bool disabled)
func (_Storage *StorageFilterer) WatchTaskDisabled(opts *bind.WatchOpts, sink chan<- *StorageTaskDisabled, taskId []*big.Int) (event.Subscription, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _Storage.contract.WatchLogs(opts, "TaskDisabled", taskIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StorageTaskDisabled)
				if err := _Storage.contract.UnpackLog(event, "TaskDisabled", log); err != nil {
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
func (_Storage *StorageFilterer) ParseTaskDisabled(log types.Log) (*StorageTaskDisabled, error) {
	event := new(StorageTaskDisabled)
	if err := _Storage.contract.UnpackLog(event, "TaskDisabled", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// StorageTaskModifiedIterator is returned from FilterTaskModified and is used to iterate over the raw logs and unpacked data for TaskModified events raised by the Storage contract.
type StorageTaskModifiedIterator struct {
	Event *StorageTaskModified // Event containing the contract specifics and raw log

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
func (it *StorageTaskModifiedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StorageTaskModified)
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
		it.Event = new(StorageTaskModified)
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
func (it *StorageTaskModifiedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StorageTaskModifiedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StorageTaskModified represents a TaskModified event raised by the Storage contract.
type StorageTaskModified struct {
	TaskId *big.Int
	Issuer common.Address
	Task   TaskInfo
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterTaskModified is a free log retrieval operation binding the contract event 0x578ed947bb62f4f6619923070597ab20ab5e6b418d016db2c52c17053d5b5017.
//
// Solidity: event TaskModified(uint256 indexed taskId, address issuer, (string,string,string,uint8,uint112,uint32,uint48,bool) task)
func (_Storage *StorageFilterer) FilterTaskModified(opts *bind.FilterOpts, taskId []*big.Int) (*StorageTaskModifiedIterator, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _Storage.contract.FilterLogs(opts, "TaskModified", taskIdRule)
	if err != nil {
		return nil, err
	}
	return &StorageTaskModifiedIterator{contract: _Storage.contract, event: "TaskModified", logs: logs, sub: sub}, nil
}

// WatchTaskModified is a free log subscription operation binding the contract event 0x578ed947bb62f4f6619923070597ab20ab5e6b418d016db2c52c17053d5b5017.
//
// Solidity: event TaskModified(uint256 indexed taskId, address issuer, (string,string,string,uint8,uint112,uint32,uint48,bool) task)
func (_Storage *StorageFilterer) WatchTaskModified(opts *bind.WatchOpts, sink chan<- *StorageTaskModified, taskId []*big.Int) (event.Subscription, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _Storage.contract.WatchLogs(opts, "TaskModified", taskIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StorageTaskModified)
				if err := _Storage.contract.UnpackLog(event, "TaskModified", log); err != nil {
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

// ParseTaskModified is a log parse operation binding the contract event 0x578ed947bb62f4f6619923070597ab20ab5e6b418d016db2c52c17053d5b5017.
//
// Solidity: event TaskModified(uint256 indexed taskId, address issuer, (string,string,string,uint8,uint112,uint32,uint48,bool) task)
func (_Storage *StorageFilterer) ParseTaskModified(log types.Log) (*StorageTaskModified, error) {
	event := new(StorageTaskModified)
	if err := _Storage.contract.UnpackLog(event, "TaskModified", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// StorageTransferIterator is returned from FilterTransfer and is used to iterate over the raw logs and unpacked data for Transfer events raised by the Storage contract.
type StorageTransferIterator struct {
	Event *StorageTransfer // Event containing the contract specifics and raw log

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
func (it *StorageTransferIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StorageTransfer)
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
		it.Event = new(StorageTransfer)
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
func (it *StorageTransferIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StorageTransferIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StorageTransfer represents a Transfer event raised by the Storage contract.
type StorageTransfer struct {
	From    common.Address
	To      common.Address
	TokenId *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterTransfer is a free log retrieval operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
func (_Storage *StorageFilterer) FilterTransfer(opts *bind.FilterOpts, from []common.Address, to []common.Address, tokenId []*big.Int) (*StorageTransferIterator, error) {

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

	logs, sub, err := _Storage.contract.FilterLogs(opts, "Transfer", fromRule, toRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &StorageTransferIterator{contract: _Storage.contract, event: "Transfer", logs: logs, sub: sub}, nil
}

// WatchTransfer is a free log subscription operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
func (_Storage *StorageFilterer) WatchTransfer(opts *bind.WatchOpts, sink chan<- *StorageTransfer, from []common.Address, to []common.Address, tokenId []*big.Int) (event.Subscription, error) {

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

	logs, sub, err := _Storage.contract.WatchLogs(opts, "Transfer", fromRule, toRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StorageTransfer)
				if err := _Storage.contract.UnpackLog(event, "Transfer", log); err != nil {
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
func (_Storage *StorageFilterer) ParseTransfer(log types.Log) (*StorageTransfer, error) {
	event := new(StorageTransfer)
	if err := _Storage.contract.UnpackLog(event, "Transfer", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// StorageUnlockedIterator is returned from FilterUnlocked and is used to iterate over the raw logs and unpacked data for Unlocked events raised by the Storage contract.
type StorageUnlockedIterator struct {
	Event *StorageUnlocked // Event containing the contract specifics and raw log

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
func (it *StorageUnlockedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(StorageUnlocked)
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
		it.Event = new(StorageUnlocked)
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
func (it *StorageUnlockedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *StorageUnlockedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// StorageUnlocked represents a Unlocked event raised by the Storage contract.
type StorageUnlocked struct {
	TokenId *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterUnlocked is a free log retrieval operation binding the contract event 0xf27b6ce5b2f5e68ddb2fd95a8a909d4ecf1daaac270935fff052feacb24f1842.
//
// Solidity: event Unlocked(uint256 tokenId)
func (_Storage *StorageFilterer) FilterUnlocked(opts *bind.FilterOpts) (*StorageUnlockedIterator, error) {

	logs, sub, err := _Storage.contract.FilterLogs(opts, "Unlocked")
	if err != nil {
		return nil, err
	}
	return &StorageUnlockedIterator{contract: _Storage.contract, event: "Unlocked", logs: logs, sub: sub}, nil
}

// WatchUnlocked is a free log subscription operation binding the contract event 0xf27b6ce5b2f5e68ddb2fd95a8a909d4ecf1daaac270935fff052feacb24f1842.
//
// Solidity: event Unlocked(uint256 tokenId)
func (_Storage *StorageFilterer) WatchUnlocked(opts *bind.WatchOpts, sink chan<- *StorageUnlocked) (event.Subscription, error) {

	logs, sub, err := _Storage.contract.WatchLogs(opts, "Unlocked")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(StorageUnlocked)
				if err := _Storage.contract.UnpackLog(event, "Unlocked", log); err != nil {
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
func (_Storage *StorageFilterer) ParseUnlocked(log types.Log) (*StorageUnlocked, error) {
	event := new(StorageUnlocked)
	if err := _Storage.contract.UnpackLog(event, "Unlocked", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
