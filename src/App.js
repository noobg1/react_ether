import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor (props) {
    super(props);

    const MyContract = window.web3.eth.contract([
      {
        "constant": true,
        "inputs": [],
        "name": "pseudoRandomResult",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getState",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getSecret",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "blah",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "result",
            "type": "bool"
          }
        ],
        "name": "ExperimentComplete",
        "type": "event"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "kill",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "setExperimentInMotion",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "newState",
            "type": "string"
          }
        ],
        "name": "setState",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
      }
    ]);

    this.state = {
      ContractInstance: MyContract.at('0x3f6368f11c1ac45a277f72fefb5815f3c92e752b'),
      contractState: ''
    }

    this.state.event = this.state.ContractInstance.ExperimentComplete();
  }
  querySecret() {
    const { getSecret } = this.state.ContractInstance;

    getSecret((err, secret) => {
      if (err) console.error('An error occured::::', err);
      console.log('This is our contract\'s secrect::::', secret);
    })
  }

  queryContractState() {
    const { getState } = this.state.ContractInstance;

    getState((err, state) => {
      if (err) console.error('An error occured::::', err);
      console.log('This is our contract\'s secrect::::', state);
    })
  }

  handleContractStateSubmit(event) {
    event.preventDefault();
    const { setState } = this.state.ContractInstance;
    const { contractState: newState } = this.state;
    setState (
      newState,
      {
        gas: 300000,
        from: window.web3.eth.accounts[0],
        value: window.web3.toWei(0.01, 'ether')
      }, (err, result) => {
        console.log('smart contract state is changing');
      }
    )
  }

  queryConditionalResult() {
    const { pseudoRandomResult } = this.state.ContractInstance;

    pseudoRandomResult ((err, result) => {
      console.log('this is the smart contract conditional', result);
    })
  }

  activateExperiment() {
    const { setExperimentInMotion } = this.state.ContractInstance;

    setExperimentInMotion ({
      gas: 300000,
      from: window.web3.eth.accounts[0],
      value: window.web3.toWei(0.01, 'ether')
    }, (err, result) => {
      console.log('smart contract state is changing');
    })
  }

  render() {

    this.state.event.watch ((err, event) => {
      if (err) console.log('An error occured:::', err);
      console.log('this is the event', event);
      console.log('this is the experiment result', event.args.result);
    })
    return (
      <div className="App">
        <br/>
        <br/>
        <button onClick={this.queryContractState.bind(this)}>State</button>
        <br/>
        <button onClick={this.querySecret.bind(this)}>Secret</button>
        <br/>
        <br/>
        <form onSubmit={this.handleContractStateSubmit.bind(this)}>
          <input
            value={this.state.contractState}
            onChange={event => this.setState({contractState: event.target.value})}
          />
          <button type="submit">submit</button>
        </form>

        <br/>
        <br/>
        <button onClick={this.queryConditionalResult.bind(this)}>Query smart Contract Conditional Result</button>
        <br/>
        <br/>
        <button onClick={this.activateExperiment.bind(this)}>Start experiment on smart contract</button>
      </div>
    );
  }
}

export default App;
