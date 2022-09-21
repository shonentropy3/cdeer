const CAKE = [
    'event Approval(address indexed owner, address indexed spender, uint256 value)',
    'event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate)',
    'event DelegateVotesChanged(address indexed delegate, uint256 previousBalance, uint256 newBalance)',
    'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'function DELEGATION_TYPEHASH() view returns (bytes32)',
    'function DOMAIN_TYPEHASH() view returns (bytes32)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function balanceOf(address account) view returns (uint256)',
    'function checkpoints(address, uint32) view returns (uint32 fromBlock, uint256 votes)',
    'function decimals() view returns (uint8)',
    'function decreaseAllowance(address spender, uint256 subtractedValue) returns (bool)',
    'function delegate(address delegatee)',
    'function delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s)',
    'function delegates(address delegator) view returns (address)',
    'function getCurrentVotes(address account) view returns (uint256)',
    'function getOwner() view returns (address)',
    'function getPriorVotes(address account, uint256 blockNumber) view returns (uint256)',
    'function increaseAllowance(address spender, uint256 addedValue) returns (bool)',
    'function mint(address _to, uint256 _amount)',
    'function mint(uint256 amount) returns (bool)',
    'function name() view returns (string)',
    'function nonces(address) view returns (uint256)',
    'function numCheckpoints(address) view returns (uint32)',
    'function owner() view returns (address)',
    'function renounceOwnership()',
    'function symbol() view returns (string)',
    'function totalSupply() view returns (uint256)',
    'function transfer(address recipient, uint256 amount) returns (bool)',
    'function transferFrom(address sender, address recipient, uint256 amount) returns (bool)',
    'function transferOwnership(address newOwner)'
];

const ERC20 = [
    'constructor()',
    'event Approval(address indexed owner, address indexed spender, uint256 value)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 value) returns (bool)',
    'function balanceOf(address account) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function totalSupply() view returns (uint256)',
    'function transfer(address recipient, uint256 amout) returns (bool)',
    'function transferFrom(address sender, address recipient, uint256 amount) returns (bool)'
];

const PancakeFactory = [{
        "inputs": [{
            "internalType": "address",
            "name": "_feeToSetter",
            "type": "address"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "token0",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "token1",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "pair",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "PairCreated",
        "type": "event"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "INIT_CODE_PAIR_HASH",
        "outputs": [{
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "name": "allPairs",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "allPairsLength",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
                "internalType": "address",
                "name": "tokenA",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "tokenB",
                "type": "address"
            }
        ],
        "name": "createPair",
        "outputs": [{
            "internalType": "address",
            "name": "pair",
            "type": "address"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "feeTo",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "feeToSetter",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "getPair",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "internalType": "address",
            "name": "_feeTo",
            "type": "address"
        }],
        "name": "setFeeTo",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "internalType": "address",
            "name": "_feeToSetter",
            "type": "address"
        }],
        "name": "setFeeToSetter",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const Master_Chef = [
    'constructor(address _cake, address _syrup, address _devaddr, uint256 _cakePerBlock, uint256 _startBlock)',
    'event Deposit(address indexed user, uint256 indexed pid, uint256 amount)',
    'event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount)',
    'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
    'event Withdraw(address indexed user, uint256 indexed pid, uint256 amount)',
    'function BONUS_MULTIPLIER() view returns (uint256)',
    'function add(uint256 _allocPoint, address _lpToken, bool _withUpdate)',
    'function cake() view returns (address)',
    'function cakePerBlock() view returns (uint256)',
    'function deposit(uint256 _pid, uint256 _amount)',
    'function dev(address _devaddr)',
    'function devaddr() view returns (address)',
    'function emergencyWithdraw(uint256 _pid)',
    'function enterStaking(uint256 _amount)',
    'function getMultiplier(uint256 _from, uint256 _to) view returns (uint256)',
    'function leaveStaking(uint256 _amount)',
    'function massUpdatePools()',
    'function migrate(uint256 _pid)',
    'function migrator() view returns (address)',
    'function owner() view returns (address)',
    'function pendingCake(uint256 _pid, address _user) view returns (uint256)',
    'function poolInfo(uint256) view returns (address lpToken, uint256 allocPoint, uint256 lastRewardBlock, uint256 accCakePerShare)',
    'function poolLength() view returns (uint256)',
    'function renounceOwnership()',
    'function set(uint256 _pid, uint256 _allocPoint, bool _withUpdate)',
    'function setMigrator(address _migrator)',
    'function startBlock() view returns (uint256)',
    'function syrup() view returns (address)',
    'function totalAllocPoint() view returns (uint256)',
    'function transferOwnership(address newOwner)',
    'function updateMultiplier(uint256 multiplierNumber)',
    'function updatePool(uint256 _pid)',
    'function userInfo(uint256, address) view returns (uint256 amount, uint256 rewardDebt)',
    'function withdraw(uint256 _pid, uint256 _amount)'
]

const Oracle = [
    'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
    'function getPrice(address token) view returns (uint256)',
    'function owner() view returns (address)',
    'function renounceOwnership()',
    'function setPrice(address _token, uint256 _price)',
    'function transferOwnership(address newOwner)'
]

const Pancake_Router = [
    'constructor(address _factory, address _WETH)',
    'function WETH() view returns (address)',
    'function addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) returns (uint256 amountA, uint256 amountB, uint256 liquidity)',
    'function addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity)',
    'function factory() view returns (address)',
    'function getAmountIn(uint256 amountOut, uint256 reserveIn, uint256 reserveOut) pure returns (uint256 amountIn)',
    'function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) pure returns (uint256 amountOut)',
    'function getAmountsIn(uint256 amountOut, address[] path) view returns (uint256[] amounts)',
    'function getAmountsOut(uint256 amountIn, address[] path) view returns (uint256[] amounts)',
    'function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) pure returns (uint256 amountB)',
    'function removeLiquidity(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) returns (uint256 amountA, uint256 amountB)',
    'function removeLiquidityETH(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) returns (uint256 amountToken, uint256 amountETH)',
    'function removeLiquidityETHSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) returns (uint256 amountETH)',
    'function removeLiquidityETHWithPermit(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) returns (uint256 amountToken, uint256 amountETH)',
    'function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) returns (uint256 amountETH)',
    'function removeLiquidityWithPermit(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) returns (uint256 amountA, uint256 amountB)',
    'function swapETHForExactTokens(uint256 amountOut, address[] path, address to, uint256 deadline) payable returns (uint256[] amounts)',
    'function swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) payable returns (uint256[] amounts)',
    'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) payable',
    'function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) returns (uint256[] amounts)',
    'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
    'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) returns (uint256[] amounts)',
    'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
    'function swapTokensForExactETH(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) returns (uint256[] amounts)',
    'function swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) returns (uint256[] amounts)'
]

const PancakePair = [
    'constructor()',
    'event Approval(address indexed owner, address indexed spender, uint256 value)',
    'event Burn(address indexed sender, uint256 amount0, uint256 amount1, address indexed to)',
    'event Mint(address indexed sender, uint256 amount0, uint256 amount1)',
    'event Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address indexed to)',
    'event Sync(uint112 reserve0, uint112 reserve1)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'function DOMAIN_SEPARATOR() view returns (bytes32)',
    'function MINIMUM_LIQUIDITY() view returns (uint256)',
    'function PERMIT_TYPEHASH() view returns (bytes32)',
    'function allowance(address, address) view returns (uint256)',
    'function approve(address spender, uint256 value) returns (bool)',
    'function balanceOf(address) view returns (uint256)',
    'function burn(address to) returns (uint256 amount0, uint256 amount1)',
    'function decimals() view returns (uint8)',
    'function factory() view returns (address)',
    'function getReserves() view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast)',
    'function initialize(address _token0, address _token1)',
    'function kLast() view returns (uint256)',
    'function mint(address to) returns (uint256 liquidity)',
    'function name() view returns (string)',
    'function nonces(address) view returns (uint256)',
    'function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)',
    'function price0CumulativeLast() view returns (uint256)',
    'function price1CumulativeLast() view returns (uint256)',
    'function skim(address to)',
    'function swap(uint256 amount0Out, uint256 amount1Out, address to, bytes data)',
    'function symbol() view returns (string)',
    'function sync()',
    'function token0() view returns (address)',
    'function token1() view returns (address)',
    'function totalSupply() view returns (uint256)',
    'function transfer(address to, uint256 value) returns (bool)',
    'function transferFrom(address from, address to, uint256 value) returns (bool)'
]


const WBNB = [
    'function name() view returns (string)',
    'function approve(address guy, uint256 wad) returns (bool)',
    'function a() payable',
    'function totalSupply() view returns (uint256)',
    'function transferFrom(address src, address dst, uint256 wad) returns (bool)',
    'function withdraw(uint256 wad)',
    'function decimals() view returns (uint8)',
    'function balanceOf(address) view returns (uint256)',
    'function symbol() view returns (string)',
    'function transfer(address dst, uint256 wad) returns (bool)',
    'function deposit() payable',
    'function allowance(address, address) view returns (uint256)',
    'event Approval(address indexed src, address indexed guy, uint256 wad)',
    'event Transfer(address indexed src, address indexed dst, uint256 wad)',
    'event Deposit(address indexed dst, uint256 wad)',
    'event Withdrawal(address indexed src, uint256 wad)'
]

module.exports = {
    ERC20,
    CAKE,
    Master_Chef,
    Oracle,
    Pancake_Router,
    PancakeRouter: Pancake_Router,
    PancakePair,
    PancakeFactory,
    WBNB,
}