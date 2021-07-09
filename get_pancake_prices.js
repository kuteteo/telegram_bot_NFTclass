const Web3 = require('web3');
const pancakeapi = require('./pancakeAPI')
const fs = require('fs');
const ethers  = require('ethers')

/*
Required Node.js
-- Usage --
1. Make a directory on your pc
2. Open a terminal 
3. go inside the created directory
4. run : npm init
5. run : npm i --save web3
6. Create a file: tokenPrice.js
7. Copy this text inside that file
8. run: node tokenPrice.js
*/

const pancakePairJson = "pancakepair.json";
const pancakePair = JSON.parse(fs.readFileSync(pancakePairJson));
let url = 'https://bsc-dataseed1.binance.org';
let provider = new ethers.providers.JsonRpcProvider(url);

const nameToken = async(tokenAddres) => {
 
  const tokenContract0 = new ethers.Contract(tokenAddres, pancakePair, provider)
 return await tokenContract0.name()
}

let pancakeSwapContract = "0x10ED43C718714eb63d5aA57B78B54704E256024E".toLowerCase();
const web3 = new Web3("https://bsc-dataseed1.binance.org");
async function calcSell( tokensToSell, tokenAddres){
    const web3 = new Web3("https://bsc-dataseed1.binance.org");
    const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //BNB

    let tokenRouter = await new web3.eth.Contract( pancakeapi.tokenAbi, tokenAddres );
    let tokenDecimals = await tokenRouter.methods.decimals().call();
    
    tokensToSell = setDecimals(tokensToSell, tokenDecimals);
    let amountOut;
    try {
        let router = await new web3.eth.Contract( pancakeapi.pancakeSwapAbi, pancakeSwapContract );
        amountOut = await router.methods.getAmountsOut(tokensToSell, [tokenAddres ,BNBTokenAddress]).call();
        amountOut =  web3.utils.fromWei(amountOut[1]);
    } catch (error) {}
   
    if(!amountOut) return 0;
    return amountOut;
}
async function calcBNBPrice(){
    const web3 = new Web3("https://bsc-dataseed1.binance.org");
    const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //BNB
    const USDTokenAddress  = "0x55d398326f99059fF775485246999027B3197955" //USDT
    let bnbToSell = web3.utils.toWei("1", "ether") ;
    let amountOut;
    try {
        let router = await new web3.eth.Contract(pancakeapi.pancakeSwapAbi, pancakeSwapContract );
        amountOut = await router.methods.getAmountsOut(bnbToSell, [BNBTokenAddress ,USDTokenAddress]).call();
        amountOut =  web3.utils.fromWei(amountOut[1]);
    } catch (error) {}
    if(!amountOut) return 0;
    return amountOut;
}
function setDecimals( number, decimals ){
    number = number.toString();
   
    let numberAbs = number.split('.')[0]
    let numberDecimals = number.split('.')[1] ? number.split('.')[1] : '';
    while( numberDecimals.length < decimals ){
        numberDecimals += "0";
    }
    return numberAbs + numberDecimals;
}
/*
How it works?
This script simply comunicates with the smart contract deployed by pancakeswap and calls the main
function that was build to retrive the token prices
*/
const getprice = async (addres) => {
    const tokenAddres = addres; // change this with the token addres that you want to know the 
    let bnbPrice = await calcBNBPrice() // query pancakeswap to get the price of BNB in USDT
    // console.log(`CURRENT BNB PRICE: ${bnbPrice}`);
     let priceInBnb = await calcSell(1000000, tokenAddres)/1000000; // calculate TOKEN price in BNB, sometimes setting only 1 instead of 1000 cause errors
    // console.log( 'SHIT_TOKEN VALUE IN BNB : ' + priceInBnb + ' | Just convert it to USD ' );
   
    return priceInBnb*bnbPrice // convert the token price from BNB to USD based on the retrived BNB value
}

module.exports = {
  getprice,
  nameToken

}







