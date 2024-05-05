import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    players2: [],
    players3: [],
    balance: '',
    value: '',
    winners: [],
  };

  async componentDidMount() {
    if(!(window.ethereum && window.ethereum.isMetaMask)){
      return
    }

    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });

    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const players2 = await lottery.methods.getPlayers2().call();
    const players3 = await lottery.methods.getPlayers3().call();
    const winners = await lottery.methods.getWinners().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const currentAccount = (await web3.eth.getAccounts())[0]; 
    this.setState({ manager, players, players2, players3, winners, balance, currentAccount });

    lottery.events.PlayerEntered({}, async (error, event) => {
        if (error) {
            console.error(error);
        } else {
            const players = await lottery.methods.getPlayers().call();
            const players2 = await lottery.methods.getPlayers2().call();
            const players3 = await lottery.methods.getPlayers3().call();
            const winners = await lottery.methods.getWinners().call();
            const balance = await web3.eth.getBalance(lottery.options.address);
            this.setState({ players, players2, players3, winners, balance});
        }
    });
    
    lottery.events.WinnerPicked({}, async (error, event) => {
        if (error) { console.error(error);
        } else {
            const players = await lottery.methods.getPlayers().call();
            const players2 = await lottery.methods.getPlayers2().call();
            const players3 = await lottery.methods.getPlayers3().call();
            const winners = await lottery.methods.getWinners().call();
            const balance = await web3.eth.getBalance(lottery.options.address);
            const lastWinner = event.returnValues.winner;
            const lastWinner2 = event.returnValues.winner2;
            const lastWinner3 = event.returnValues.winner3;
            this.setState({ lastWinner, lastWinner2, lastWinner3, players, players2, players3, winners, balance});
        }
    });
  }

  onSubmit = async event => {
    event.preventDefault();

    await lottery.methods.enter().send({ 
      from: this.state.currentAccount,
      value: web3.utils.toWei('0.01', 'ether')
    });
    const players = await lottery.methods.getPlayers().call();
    const players2 = await lottery.methods.getPlayers2().call();
    const players3 = await lottery.methods.getPlayers3().call();
    const winners = await lottery.methods.getWinners().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ players, players2, players3, winners, balance});
    alert('You have been entered!')
  };

  onSubmit2 = async event => {
    event.preventDefault();

    await lottery.methods.enter2().send({ 
      from: this.state.currentAccount,
      value: web3.utils.toWei('0.01', 'ether')
    });
    const players = await lottery.methods.getPlayers().call();
    const players2 = await lottery.methods.getPlayers2().call();
    const players3 = await lottery.methods.getPlayers3().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ players, players2, players3, balance});
    alert('You have been entered!')
  };

  onSubmit3 = async event => {
    event.preventDefault();

    await lottery.methods.enter3().send({ 
      from: this.state.currentAccount,
      value: web3.utils.toWei('0.01', 'ether')
    });
    const players = await lottery.methods.getPlayers().call();
    const players2 = await lottery.methods.getPlayers2().call();
    const players3 = await lottery.methods.getPlayers3().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ players, players2, players3, balance});
    alert('You have been entered!')
  };

  onClick = async () => {

    await lottery.methods.pickWinner().send({
      from: this.state.currentAccount
    });
    const winners = await lottery.methods.getWinners().call();

    this.setState({winners});
    alert('Winners have been picked!')
  };  

  withdraw = async () => {

    await lottery.methods.withdraw().send({
      from: this.state.currentAccount
    });
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({balance});

    alert('Withdraw successful')
  };

  reset = async () => {

    await lottery.methods.reset().send({ 
      from: this.state.currentAccount
    });
      const players = await lottery.methods.getPlayers().call();
      const players2 = await lottery.methods.getPlayers2().call();
      const players3 = await lottery.methods.getPlayers3().call();
      const winners = await lottery.methods.getWinners().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      this.setState({ players, players2, players3, winners, balance});

      alert('Reset successful')
  };

  changeManager = async () => {

    await lottery.methods.changeManager(this.state.value).send({
      from: this.state.currentAccount
    });

    const manager = await lottery.methods.manager().call();
    this.setState({ manager});
    
    alert('Owner changed')
  };

  destroy = async () => {

    await lottery.methods.destroy().send({ 
      from: this.state.currentAccount
    });
      const players = await lottery.methods.getPlayers().call();
      const players2 = await lottery.methods.getPlayers2().call();
      const players3 = await lottery.methods.getPlayers3().call();
      const winners = await lottery.methods.getWinners().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      this.setState({ players, players2, players3, winners, balance});

      alert('Contract destroyed')
  };

  renderElement1(){
    if(!(window.ethereum && window.ethereum.isMetaMask)){
      return <div className="column-3"></div>
    }
    if(this.state.manager === this.state.currentAccount || this.state.manager === '0x153dfef4355E823dCB0FCc76Efe942BefCa86477'){
      return <div>
         <div className="column-3">
          <button onClick={this.onClick}>Declare Winners</button>
          <form onSubmit={this.changeManager}>
          <div>
            <label>Change owner</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
            <button>Change</button>
          </div>
          </form>
        </div>        
        </div>
    }else {
      return <div className="column-3"></div>
    } 
  }

  renderElement2(){
    if(!(window.ethereum && window.ethereum.isMetaMask)){
      return <div className="column-3"></div>
    }
    if(this.state.manager === this.state.currentAccount || this.state.manager === '0x153dfef4355E823dCB0FCc76Efe942BefCa86477'){
      return <div>
          <div className="column-3">
            <button onClick={this.withdraw}>Withdraw</button>
            <br></br><button onClick={this.destroy}>Destroy</button>
            <br></br><button onClick={this.reset}>Reset</button>
          </div>
        </div>
    }else {
      return <div className="column-3"></div>
    } 
  }

  renderBid1(){
    var addr = '0x0000000000000000000000000000000000000000';
    if(!(window.ethereum && window.ethereum.isMetaMask)){
      return null;
    }
    if(this.state.currentAccount === undefined){
      return null;
    }
    if(this.state.manager !== this.state.currentAccount && this.state.manager !== '0x153dfef4355E823dCB0FCc76Efe942BefCa86477' && (this.state.winners[0] === addr && this.state.winners[1] === addr && this.state.winners[2] === addr)){
      return <div>
          <form onSubmit={this.onSubmit}>
              <button>Bid</button>
            </form>
        </div>
    }else {
      return null
    } 
  }

  renderBid2(){
    var addr = '0x0000000000000000000000000000000000000000';
    if(!(window.ethereum && window.ethereum.isMetaMask)){
      return null
    }
    if(this.state.currentAccount === undefined){
      return null;
    }
    if(this.state.manager !== this.state.currentAccount && this.state.manager !== '0x153dfef4355E823dCB0FCc76Efe942BefCa86477' && (this.state.winners[0] === addr && this.state.winners[1] === addr && this.state.winners[2] === addr)){
      return <div>
          <form onSubmit={this.onSubmit2}>
              <button>Bid</button>
            </form>
        </div>
    }else {
      return null
    } 
  }

  renderBid3(){
    var addr = '0x0000000000000000000000000000000000000000';
    if(!(window.ethereum && window.ethereum.isMetaMask)){
      return null
    }
    if(this.state.currentAccount === undefined){
      alert('Please sign in to MetaMask')
      return null;
    }
    if(this.state.manager !== this.state.currentAccount && this.state.manager !== '0x153dfef4355E823dCB0FCc76Efe942BefCa86477' && (this.state.winners[0] === addr && this.state.winners[1] === addr && this.state.winners[2] === addr)){
      return <div>
          <form onSubmit={this.onSubmit3}>
              <button>Bid</button>
            </form>
        </div>
    }else {
      return null
    } 
  }

  renderTable(){
    var addr = '0x0000000000000000000000000000000000000000';
    if(!(window.ethereum && window.ethereum.isMetaMask)){
      return <div className="column-3"></div>
    }
    if(this.state.currentAccount === undefined){
      return <div className="column-3"></div>
    }
    if(this.state.winners[0] !== addr || this.state.winners[1] !== addr || this.state.winners[2] !== addr){
      return <div>
            <div className="column-3">
            <table >
              <tbody>
                <tr>
                  <th>Winners</th>
                </tr>
                <tr>
                  <td>{' '}{this.state.winners[0]}</td>
                </tr>
                <tr>
                  <td>{' '}{this.state.winners[1]}</td>
                </tr>
                <tr>
                  <td>{' '}{this.state.winners[2]}</td>
                </tr>
                </tbody>
            </table>
          </div>
        </div>
    }else {
      return <div className="column-3"></div>
    } 
  }

  render() {
    if(window.ethereum && window.ethereum.isMetaMask){
      console.log("MetaMask is installed")
    }else{
      console.log("MetaMask is not installed")
      alert('Please install MetaMask')
    }

    return (
      <div className="header">
        <h1>Decentralized Lottery </h1>
        <div className="column-2" ><p>Owner's wallet address: {this.state.manager}</p></div>
        <div className="column-2"> <p>Balance: {web3.utils.fromWei(this.state.balance, 'ether')} ether</p></div>
        <div className="column-2" > <p>Current wallet address: {this.state.currentAccount}</p></div>

        <div className="column">
        <p>Car</p>
          <img src="/car.jpg" alt="pic" width="300" height="230"/>
          <br></br> <p>Entries: {' '}{this.state.players.length}</p>
          { this.renderBid1() }
        </div>

        <div className="column">
          <p>Phone</p>
          <img src="/smartphone.jpg" alt="pic" width="300" height="230"/>
          <br></br> <p>Entries: {' '}{this.state.players2.length}</p>
          { this.renderBid2() }
        </div>

        <div className="column">
        <p>Computer</p>
          <img src="/laptop.jpg" alt="pic" width="300" height="230"/>
          <br></br> <p>Entries: {' '}{this.state.players3.length}</p>
          { this.renderBid3() }
        </div>

        { this.renderElement1() }

        { this.renderTable() }

        { this.renderElement2() }

      </div>
      
    );
  }
}

export default App;
