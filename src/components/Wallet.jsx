import React, { useState, useEffect } from "react";
import axios from "../api";
import { Form, Button, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import {
  saveWalletIdToLocalStorage,
  getWalletIdFromLocalStorage,
} from "../utils";
import { Link } from "react-router-dom";
const Wallet = () => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("CREDIT");
  const [description, setDescription] = useState("");
  const [walletId, setWalletId] = useState(getWalletIdFromLocalStorage());
  const [loader, setloader] = useState(false);
  const [loader2, setloader2] = useState(false);

  useEffect(() => {
    const fetchWalletDetails = async () => {
      setloader(true);
      // Check if there is a wallet id in local storage
      const id = getWalletIdFromLocalStorage();
      if (id) {
        // Fetch the wallet details from the api
        const response = await axios.get(`/wallet/${id}`);
        if (response.data) {
          // Set the wallet state
          setName(response.data.name);
          setBalance(response.data.balance);
          setWalletId(id);
        }
      }
      setloader(false);
    };
    fetchWalletDetails();
  }, []);

  const handleNameChange = (e) => {
    // Update the name state
    setName(e.target.value);
  };

  const handleBalanceChange = (e) => {
    // Update the balance state
    let val = e.target.value;
    let num = parseFloat(e.target.value).toFixed(4);
    setBalance(num);
  };

  const handleAmountChange = (e) => {
    // Update the amount state
    let val = e.target.value;
    let num = parseFloat(e.target.value).toFixed(4);
    console.log("num::", num);
    setAmount(num);
  };

  const handleTypeChange = (val) => {
    console.log("in handleTypeChange", val);
    // Update the type state
    setType(val ? "DEBIT" && setAmount(-amount) : "CREDIT");
  };

  const handleSubmit = async (e) => {
    setloader2(true);
    e.preventDefault();
    if (!walletId) {
      // Create a new wallet with the api
    setloader(true);

      const response = await axios.post("/wallet/setup", {
        name: name,
        balance: parseFloat(balance),
      });

      if (response.data) {
        // Save the wallet id in local storage
        saveWalletIdToLocalStorage(response.data.id);
        // Set the wallet state
        setName(response.data.name);
        setBalance(response.data.balance);
        setWalletId(response.data.id);
      }
    setloader(false);

      setloader2(false);
    } else {
      // Execute a transaction with the api
      const response = await axios.post(`/wallet/transact/${walletId}`, {
        amount: parseFloat(amount),
        description,
      });
      console.log(response);
      if (response.data) {
        setBalance(response.data.balance);
      }
      setloader2(false);
    }
  };

  return (
    <div className="container p-4">
      <h1 className="text-3xl font-bold">Wallet App</h1>
      {loader && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!walletId ? (
        <Form onSubmit={handleSubmit} className="mt-4">
          <Form.Group className="mb-3">
            <Form.Label>Enter your name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your name"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Enter initial balance (optional)</Form.Label>
            <Form.Control
              type="number"
              inputMode="decimal"
              step="any"              
              onChange={handleBalanceChange}
              placeholder="Enter initial balance (optional)"
              
            />
          </Form.Group>
          <Button  disabled={loader || name === ""} type="submit" variant="primary">
            Submit
          </Button>
        </Form>
      ) : (
        !loader && (
          <div className="mt-4">
            <p>
              Welcome, <strong>{name}</strong>!
            </p>
            <p>
              Your wallet balance is: <strong>{balance}</strong>
            </p>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Enter transaction amount</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="decimal"
                  step="any"
                  onChange={handleAmountChange}
                  placeholder="Enter transaction amount"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="d-inline-block me-1">Credit</div>
                <div className="form-check form-switch d-inline-block">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="site_state"
                    onChange={(e) => handleTypeChange(e.target.checked)}
                  />
                  <label htmlFor="site_state" className="form-check-label">
                    Debit
                  </label>
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  placeholder="Description"
                />
              </Form.Group>
              <Button
                disabled={loader2 || amount === 0 || description === ""}
                type="submit"
                variant="primary"
              >
                Execute Transaction
                {loader2 && (
                  <>
                    {" "}
                    <span
                      className="spinner-border spinner-border-sm"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden" role="status">
                      Loading...
                    </span>
                  </>
                )}
              </Button>
            </Form>
          </div>
        )
      )}
      {walletId && (
        <div className="mt-4">
          <Link to="/transactions" className="text-blue-500 underline">
            View Transactions
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wallet;
