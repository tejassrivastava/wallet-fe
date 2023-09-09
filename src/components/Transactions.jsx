// Page 2: Transactions.js
import React, { useState, useEffect } from "react";
import axios from "../api";
import { Table, Form, Button } from "react-bootstrap";

import { CSVLink } from "react-csv";
import { getWalletIdFromLocalStorage } from "../utils";
import { Link } from "react-router-dom";
const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [walletId, setWalletId] = useState(getWalletIdFromLocalStorage());
  const [page, setPage] = useState(1);    
  const [totalpage, settotalpage] = useState(null);    
  const [sort, setSort] = useState("date");
  const [skip, setskip] = useState(0);
  const [limit, setlimit] = useState(5);
  const [loader,setloader] = useState(false);
  useEffect(() => {
    const fetchTransactions = async () => {
        setloader(true);
      // Check if there is a wallet id in local storage
      const id = getWalletIdFromLocalStorage();
      if (id) {
        // Fetch the transactions from the api
        
        const response = await axios.get(
          //   `/transactions?walletId=${id}&page=${page}&sort=${sort}&order=${order}`
          `/transactions?walletId=${id}&skip=${skip}&limit=${limit}&page=${page}&sort=${sort}`
        );
        if (response.data) {
          // Set the transactions state
          setTransactions(response.data.transactions);
          setWalletId(id);
          settotalpage(response.data.totalPages)
        }
        setloader(false)
      }else{
        setloader(false)
      }
    };
    fetchTransactions();
  }, [page, sort]);

  const handlePageChange = (page) => {
    console.log(page)
    // Update the page state
    setPage(page);
  };

  const handleSortChange = (e) => {
    // Update the sort state
    
   
    setSort(e.target.value)
  };

  const getPaginationItem = () => {
    const item = [];
    for(let i = 1; i<=totalpage;i++){
        
        item.push( <li key={i} className="page-item">
        <a className={`page-link ${page === i ? 'active' : ''}`} onClick={()=>{handlePageChange(i)}}>
          {i}
        </a>
      </li>    
        )
    }
    return item;
  }

  return (
    <div className="container p-4">
      <h1 className="text-3xl font-bold">Transactions</h1>
      {walletId === null  && (        
        <p className="mt-4">
          No wallet found. Please go back to the home page.
        </p>
      )}
      {loader ?  <div className="d-flex justify-content-center">
  <div className="spinner-border" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
</div> :
walletId && (
        <div className="mt-4">
          <Form className="d-flex flex-row gap-2 mb-3">
          
            <Form.Group className="mb-0">
              <Form.Label>Sort by:</Form.Label>
              <Form.Select value={sort} onChange={handleSortChange}>
                <option value="date">Date</option>
                <option value="amount">Amount</option>
              </Form.Select>
            </Form.Group>       
            
          </Form>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Id</th>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                  <td>{Math.abs(transaction.amount)}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.balance}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="row">
         <div className="col">
         {transactions.length > 0 && (
            <div className="justify-content-end">
            <CSVLink data={transactions} filename="transactions.csv">
              <Button variant="outline-primary btn btn-sm">Export CSV</Button>
            </CSVLink>
            </div>
        )}
         </div>
            <div className="col">
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-end">
                <li className={`page-item ${page > totalpage - page ? '' : 'disabled' }`} onClick={()=>{
                    if(page !== 1){
                    setPage(page-1)
                    }
                }}>
                  <a className="page-link"  aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
               
               {totalpage && getPaginationItem()}
                
                
                <li  className={`page-item ${page < totalpage ? '' : 'disabled' }`}>
                  <a className="page-link" onClick={()=>{
                    setPage(page+1)
                }} aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <Link to="/" className="text-blue-500 underline">
          Go Back
        </Link>
      </div>
    </div>
  );
};
export default Transactions;
