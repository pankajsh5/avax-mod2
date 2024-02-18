import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import pankajSharmaWalletAbi from "../artifacts/contracts/Assessment.sol/NetflixSubscription.json"

export default function HomePage() {
  const [pankajWallet, setAshokWallet] = useState(undefined);
  const [pankajAccount, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);

  const changePassPrev = useRef();
  const changePassNew = useRef();

  const grantAccessAddr = useRef();

  const revokeAccessAddr = useRef();

  const loginAddr = useRef();
  const loginPass = useRef();


  const contractAddress = "0xD9020c84eF2209323204484ab58106773e686303";
  const atmABI = pankajSharmaWalletAbi.abi;

  const getWalletAddress = async () => {
    if (window.ethereum) {
      setAshokWallet(window.ethereum);
    }

    if (pankajWallet) {
      try {
        const accounts = await pankajWallet.request({ method: "eth_accounts" });
        accoundHandler(accounts);
      } catch (error) {
        console.log("error", error)
      }
    }
  };

  const accoundHandler = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No pankajAccount found");
    }
  };


  const connectToMetamask = async () => {
    if (!pankajWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await pankajWallet.request({ method: "eth_requestAccounts" });
    accoundHandler(accounts);

    // once wallet is set, we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(pankajWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const changePassword = async () => {
    let prevKey = Number(changePassPrev.current.value);
    let newKey = Number(changePassNew.current.value);
    try {
      if (atm) {
        let tx = await atm.changePassword(prevKey, newKey);
        await tx.wait();
        console.log(`PASSWORD CHANGED SUCCESSFULLY`);
      }
    } catch (error) {
      console.log("SOMETHING WENT WRONG");
      console.log(error);
    }
  }

  const grantAccess = async () => {
    let addr = grantAccessAddr.current.value;
    try {
      if (atm) {
        let tx = await atm.grantAccess(addr);
        await tx.wait();
        console.log(`ACCESS GRANTED : ${addr}`);
      }
    } catch (error) {
      console.log("SOMETHING WENT WRONG");
      console.log(error);
    }
  }

  const revokeAccess = async () => {
    let addr = revokeAccessAddr.current.value;
    try {
      if (atm) {
        let tx = await atm.revokeAccess(addr);
        await tx.wait();
        console.log(`ACCESS REVOKED : ${addr}`);
      }
    } catch (error) {
      console.log("SOMETHING WENT WRONG");
      console.log(error);
    }
  }

  const login = async () => {
    let addr = loginAddr.current.value;
    let pass = Number(loginPass.current.value);
    try {
      if (atm) {
        let tx = await atm.loginAccount(addr,pass);
        await tx.wait();
        console.log(`LOGGED IN`);
      }
    } catch (error) {
      console.log("SOMETHING WENT WRONG");
      console.log(error);
    }
  }

  useEffect(() => {
    getWalletAddress();
  }, []);


  return (
    <main className="container">
      <header>
        <h1>Netflix Subscription</h1>
      </header>
      <div className="content">
        {!pankajAccount ? (<button onClick={connectToMetamask}>Start Netflix Subscription</button>)
          : (
            <>
              <div className="div">
                <div className="container">
                  <button onClick={changePassword}>CHANGE PASSWORD</button>
                  <div>
                    <input ref={changePassPrev} type="password" placeholder="Previous Password"></input>
                    <input ref={changePassNew} type="password" placeholder="New Password"></input>
                  </div>
                </div>
                <div className="container">
                  <button onClick={grantAccess}>GRANT ACCESS</button>
                  <div>
                    <input ref={grantAccessAddr} type="password" placeholder="Address"></input>
                  </div>
                </div>
                <div className="container">
                  <button onClick={revokeAccess}>REVOKE ACCESS</button>
                  <div>
                    <input ref={revokeAccessAddr} type="password" placeholder="Address"></input>
                  </div>
                </div>
                <div className="container">
                  <button onClick={login}>LOGIN</button>
                  <div>
                    <input ref={loginAddr} type="text" placeholder="Address"></input>
                    <input ref={loginPass} type="password" placeholder="Password"></input>
                  </div>
                </div>
              </div>
            </>
          )
        }

      </div>

      <style jsx>{`
      .container {
        margin-bottom: 20px;
        width : 50vw;
        margin-inline : auto;
      }

.content {
  margin-top: 20px;
  display : flex;
  flex-direction : column;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 20vw;
  display : block;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 24px;
  color: #333;
}

.div {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap : 1em;
}

`}</style>

    </main>
  );
}
