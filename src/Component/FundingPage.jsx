import React from 'react'
import { Link } from 'react-router-dom'

function FundingPage() {
  return (
    <div className='w-full pt-40 lg:pt-24 bg-slate-200 flex justify-center items-center'>
        <div className='w-11/12 h-[50vh] bg-white rounded-lg flex justify-center p-4'>
            <div className='lg:w-5/12 text-center flex flex-col items-center justify-between'>
                <div className=' text-md px-6 text-center font-semibold text-blue-600 border border-blue-600 rounded-md bg-blue-100'>Welcome to Funding Page</div>
                <div className='text-4xl lg:text-7xl'>Funding made Fast and Easy.</div>
                <div className='text-gray-400 w-10/12'>Post your funding or investment requirements to reach global investors. Let the investors find you.</div>
                <div className='flex gap-4'>
                    <Link to={'/quick-funding'}><button className='text-white font-semibold bg-blue-600 rounded-3xl py-1 px-5'>Quick Fund</button></Link>
                    {/* <Link to={'/create-funding'}><button className='text-pink-600 font-semibold bg-gray-100 border border-gray-200 rounded-3xl py-1 px-5'>Raise Fund</button></Link> */}
                </div>
            </div>
        </div>
    </div>

//     <div className="max-w-2xl mx-auto bg-white shadow-md p-6 mt-10">
//     <header className="text-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Invoice</h1>
//         <p className="text-gray-600">Invoice Number: [Invoice Number]<br />
//             Date: [Invoice Date]<br />
//             Due Date: [Due Date]</p>
//     </header>

//     <div id="customer" className="mb-6">
//         <h2 className="text-xl font-bold text-gray-800">Bill To:</h2>
//         <p>[Customer Name]<br />
//             [Customer Address]<br />
//             [City, State, Zip Code]<br />
//             [Email Address]<br />
//             [Phone Number]</p>
//     </div>

//     <div id="product-details" className="mb-6">
//         <h2 className="text-xl font-bold text-gray-800">Product Details:</h2>
//         <table className="w-full border-collapse">
//             <thead>
//                 <tr>
//                     <th className="border p-3">Product</th>
//                     <th className="border p-3">Description</th>
//                     <th className="border p-3">Quantity</th>
//                     <th className="border p-3">Unit Price</th>
//                     <th className="border p-3">Total</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 <tr>
//                     <td className="border p-3">Product 1</td>
//                     <td className="border p-3">Description of Product 1</td>
//                     <td className="border p-3">2</td>
//                     <td className="border p-3">$50.00</td>
//                     <td className="border p-3">$100.00</td>
//                 </tr>
//                 <tr>
//                     <td className="border p-3">Product 2</td>
//                     <td className="border p-3">Description of Product 2</td>
//                     <td className="border p-3">1</td>
//                     <td className="border p-3">$30.00</td>
//                     <td className="border p-3">$30.00</td>
//                 </tr>
//                 <tr>
//                     <td className="border p-3">Product 3</td>
//                     <td className="border p-3">Description of Product 3</td>
//                     <td className="border p-3">3</td>
//                     <td className="border p-3">$20.00</td>
//                     <td className="border p-3">$60.00</td>
//                 </tr>
//             </tbody>
//         </table>
//     </div>

//     <div id="total" className="text-right">
//         <p className="mb-4">Subtotal: $190.00<br />
//             Tax (X%): $[Tax Amount]<br />
//             Shipping: $[Shipping Amount]<br />
//             Total: $[Total Amount]</p>
//     </div>

//     <div id="payment-details" className="mb-6">
//         <h2 className="text-xl font-bold text-gray-800">Payment Details:</h2>
//         <p>Payment Method: [Payment Method]<br />
//             Bank Name: [Bank Name]<br />
//             Account Number: [Account Number]<br />
//             Routing Number: [Routing Number]<br /><br />
//             Please make checks payable to [Your Company Name].</p>
//     </div>

//     <footer className="text-center text-gray-700">
//         <p>Thank you for your business!<br />
//             [Your Company Name]<br />
//             [Additional Notes or Terms]</p>
//     </footer>
// </div>
    
  )
}

export default FundingPage



// import React from 'react'
// const Invoice = () => {
//     return (
        // <div className="max-w-2xl mx-auto bg-white shadow-md p-6 mt-10">
        //     <header className="text-center mb-6">
        //         <h1 className="text-3xl font-bold text-gray-800">Invoice</h1>
        //         <p className="text-gray-600">Invoice Number: [Invoice Number]<br />
        //             Date: [Invoice Date]<br />
        //             Due Date: [Due Date]</p>
        //     </header>

        //     <div id="customer" className="mb-6">
        //         <h2 className="text-xl font-bold text-gray-800">Bill To:</h2>
        //         <p>[Customer Name]<br />
        //             [Customer Address]<br />
        //             [City, State, Zip Code]<br />
        //             [Email Address]<br />
        //             [Phone Number]</p>
        //     </div>

        //     <div id="product-details" className="mb-6">
        //         <h2 className="text-xl font-bold text-gray-800">Product Details:</h2>
        //         <table className="w-full border-collapse">
        //             <thead>
        //                 <tr>
        //                     <th className="border p-3">Product</th>
        //                     <th className="border p-3">Description</th>
        //                     <th className="border p-3">Quantity</th>
        //                     <th className="border p-3">Unit Price</th>
        //                     <th className="border p-3">Total</th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 <tr>
        //                     <td className="border p-3">Product 1</td>
        //                     <td className="border p-3">Description of Product 1</td>
        //                     <td className="border p-3">2</td>
        //                     <td className="border p-3">$50.00</td>
        //                     <td className="border p-3">$100.00</td>
        //                 </tr>
        //                 <tr>
        //                     <td className="border p-3">Product 2</td>
        //                     <td className="border p-3">Description of Product 2</td>
        //                     <td className="border p-3">1</td>
        //                     <td className="border p-3">$30.00</td>
        //                     <td className="border p-3">$30.00</td>
        //                 </tr>
        //                 <tr>
        //                     <td className="border p-3">Product 3</td>
        //                     <td className="border p-3">Description of Product 3</td>
        //                     <td className="border p-3">3</td>
        //                     <td className="border p-3">$20.00</td>
        //                     <td className="border p-3">$60.00</td>
        //                 </tr>
        //             </tbody>
        //         </table>
        //     </div>

        //     <div id="total" className="text-right">
        //         <p className="mb-4">Subtotal: $190.00<br />
        //             Tax (X%): $[Tax Amount]<br />
        //             Shipping: $[Shipping Amount]<br />
        //             Total: $[Total Amount]</p>
        //     </div>

        //     <div id="payment-details" className="mb-6">
        //         <h2 className="text-xl font-bold text-gray-800">Payment Details:</h2>
        //         <p>Payment Method: [Payment Method]<br />
        //             Bank Name: [Bank Name]<br />
        //             Account Number: [Account Number]<br />
        //             Routing Number: [Routing Number]<br /><br />
        //             Please make checks payable to [Your Company Name].</p>
        //     </div>

        //     <footer className="text-center text-gray-700">
        //         <p>Thank you for your business!<br />
        //             [Your Company Name]<br />
        //             [Additional Notes or Terms]</p>
        //     </footer>
        // </div>
//     );
// };

// export default Invoice;
