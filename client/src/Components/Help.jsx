import {React,useState} from 'react'
import { Tab } from '@headlessui/react'

const Help = () => {
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
      }

  return (
    <div className='text-white font-bold font-xl bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-md m-2 max-h-[82vh]'>
        <div className='flex flex-col text-center text-2xl underline uppercase text-[#36c072]'>Website Guide</div>
        <div className='p-[3px] mt-4 bg-[#00df9a] rounded-md h-[71vh]'>
            <div className='p-6 bg-[#182335] rounded-md h-full'>
                <Tab.Group>
                    <Tab.List className='grid grid-cols-2 lg:grid-cols-4 gap-2 justify-between items-between rounded-lg'>
                        <Tab className={({ selected }) =>
                        classNames(
                        'lg:col-start-2 w-full rounded-lg py-2.5 text-xl underline leading-5 text-lime-400',
                        'ring-opacity-60 ring-offset-2 ring-offset-blue-900 focus:outline-none focus:ring-2',
                        selected
                            ? 'bg-slate-900 shadow ring-2'
                            : 'text-blue-200 hover:bg-white/[0.12] hover:text-white'
                        )
                        }>For Voters</Tab>
                        <Tab className={({ selected }) =>
                        classNames(
                        'w-full rounded-lg py-2.5 text-xl underline leading-5 text-lime-400',
                        'ring-opacity-60 ring-offset-2 ring-offset-blue-900 focus:outline-none focus:ring-2',
                        selected
                            ? 'bg-slate-900 shadow ring-2'
                            : 'text-blue-200 hover:bg-white/[0.12] hover:text-white'
                        )
                        }>For Admin</Tab>
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel>
                            <div className='overflow-auto overflow-y-scroll scrollbar h-[60vh]'>
                            <details className="bg-slate-800 shadow-lg rounded-lg group m-4 p-4 ease-in-out duration-500">
                                <summary className="list-none flex flex-wrap items-center cursor-pointer
                                focus-visible:outline-none rounded group-open:rounded-b-none group-open:z-[1] relative">
                                <h1 className="flex flex-1 font-semibold text-lg text-blue-300">Setup Metamask Wallet</h1>
                                <div className="flex w-10 items-center justify-center">
                                    <div className="border-8 border-transparent border-l-gray-600 ml-2
                                    group-open:rotate-90 transition-transform origin-left
                                    "></div>
                                </div>
                                </summary>
                                <div className="p-4">
                                    <li>Install Metamask Extension in browser</li>
                                    <li>Create/Import existing account into metamask</li>
                                    <li>Click on the dropdown menu on top of the MetaMask wallet extension and select Add Network</li>
                                    <li>Fill in the following details:
                                        <pre>       Network Name: Polygon Mumbai Testnet</pre>
                                        <pre>       New RPC URL: https://rpc-mumbai.maticvigil.com/</pre>
                                        <pre>       Chain ID: 80001</pre>
                                        <pre>       Currency Symbol: MATIC</pre>
                                        <pre>       Block Explorer URL: https://mumbai.polygonscan.com/</pre>
                                    </li>
                                    <li>Once you have connected to the Mumbai testnet, head over to the official faucet at https://faucet.polygon.technology/ for free test tokens</li>
                                    <li>Paste your wallet address in the Wallet Address field, and select the MATIC token. Ensure that you are selecting Mumbai</li>
                                    <li>Click Submit and then click confirm. You should receive free test tokens in your wallet within a minute</li>
                                </div>
                            </details>
                            <details className="bg-slate-800 shadow-lg rounded-lg group m-4 p-4 ease-in-out duration-500">
                                <summary className="list-none flex flex-wrap items-center cursor-pointer
                                focus-visible:outline-none rounded group-open:rounded-b-none group-open:z-[1] relative">
                                <h1 className="flex flex-1 font-semibold text-lg text-blue-300">Registration</h1>
                                <div className="flex w-10 items-center justify-center">
                                    <div className="border-8 border-transparent border-l-gray-600 ml-2
                                    group-open:rotate-90 transition-transform origin-left
                                    "></div>
                                </div>
                                </summary>
                                <div className="p-4">
                                    <li>Click on Register tab from Navigation Bar</li>
                                    <li>Enter Name,Aadhar ID,Email ID in appropriate formats!</li>
                                    <li>Upload scanned copy of Aadhar ID in jpg/png/pdf formats of size less than 100Kb only</li>
                                    <li>Click on Connect Wallet</li>
                                    <li>Choose an account in the metamask popup that has MATIC funds and connect it to the website</li>
                                    <li>Click on Sign Up button on the register page</li>
                                    <li>A Modal will appear displaying a uniquely generated password and secret token for the user<pre>   STORE BOTH OF THEM SECURELY AS THEY WONT BE DISPLAYED AGAIN!</pre></li>
                                    <li>Install Google Authenticator on your mobile device<pre>   Only Google Authenticator is supported in this website</pre></li>
                                    <li>Scan the QR Code displayed in the modal with the scanner in Google Authenticator, which will set up the TOTP Two Factor Authentication</li>
                                    <li>Click on Next. Enter valid OTP displayed in Google Authenticator as input in the OTP box. Click on Verify</li>
                                    <li>If the entered OTP is valid, the Metamask wallet will popup asking User's permission to accept the Registration Transaction.Accept the transaction!</li>
                                    <li>Wait for a few seconds.Once the transaction is confirmed,Metamask notification will convey the same to the user! Registration is successful</li>
                                </div>
                            </details>
                            <details className="bg-slate-800 shadow-lg rounded-lg group m-4 p-4 ease-in-out duration-500">
                                <summary className="list-none flex flex-wrap items-center cursor-pointer
                                focus-visible:outline-none rounded group-open:rounded-b-none group-open:z-[1] relative">
                                <h1 className="flex flex-1 font-semibold text-lg text-blue-300">Login</h1>
                                <div className="flex w-10 items-center justify-center">
                                    <div className="border-8 border-transparent border-l-gray-600 ml-2
                                    group-open:rotate-90 transition-transform origin-left
                                    "></div>
                                </div>
                                </summary>
                                <div className="p-4">
                                    <pre className='text-red blink-slow text-lg font-bold'>Note: Refreshing page will lead to logout!!</pre>
                                    <li>Click on Login tab from Navigation Bar</li>
                                    <li>Enter registered Aadhar ID and password in the given input space</li>
                                    <li>Connect wallet via Metamask</li>
                                    <li>Click on Login</li>
                                    <li>Enter OTP and click on Verify</li>
                                    <li>If details are valid, user will be logged in</li>
                                    <li>Registered Users verified by Administrators will be redirected to Voter Dashboard page on login</li>
                                    <li>Registered Users not verified by Administrators will not be able to access the dashboard. Message regarding unverified status will be displayed to the user</li>
                                </div>
                            </details>
                            <details className="bg-slate-800 shadow-lg rounded-lg group m-4 p-4 ease-in-out duration-500">
                                <summary className="list-none flex flex-wrap items-center cursor-pointer
                                focus-visible:outline-none rounded group-open:rounded-b-none group-open:z-[1] relative">
                                <h1 className="flex flex-1 font-semibold text-lg text-blue-300">Voter Dashboard</h1>
                                <div className="flex w-10 items-center justify-center">
                                    <div className="border-8 border-transparent border-l-gray-600 ml-2
                                    group-open:rotate-90 transition-transform origin-left
                                    "></div>
                                </div>
                                </summary>
                                <div className="p-4">
                                    <li>From the Sidebar, user can access the pages to cast vote, check participation history and check winners of previously participated polls</li>
                                    <li>Cast Vote : User can cast a vote only once iff he is mapped to a poll by the admin. If a poll is available, click on Cast Vote button under the poll card, choose a candidate, confirm selection and accept transaction in Metamask</li>
                                    <li>Participation History : Check past poll participation records, and the time and date of when voters casted their vote</li>
                                    <li>View Results : Check participated poll winners</li>
                                </div>
                            </details>
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>
                            <div className='overflow-auto overflow-y-scroll scrollbar h-[60vh]'>
                            <div className='pt-3 text-center text-red-600'>!! ONLY ACCESSIBLE TO ADMINISTRATORS !!</div>
                            <details className="bg-slate-800 shadow-lg rounded-lg group m-4 p-4 ease-in-out duration-500">
                                <summary className="list-none flex flex-wrap items-center cursor-pointer
                                focus-visible:outline-none rounded group-open:rounded-b-none group-open:z-[1] relative">
                                <h1 className="flex flex-1 font-semibold text-lg text-blue-300">Login</h1>
                                <div className="flex w-10 items-center justify-center">
                                    <div className="border-8 border-transparent border-l-gray-600 ml-2
                                    group-open:rotate-90 transition-transform origin-left
                                    "></div>
                                </div>
                                </summary>
                                <div className="p-4">
                                    <li>Navigate to Admin Login Panel</li>
                                    <li>Enter required details in the given input space</li>
                                    <li>Connect wallet via Metamask</li>
                                    <li>Click on Login</li>
                                    <li>Enter OTP and click on Verify</li>
                                    <li>If details are valid, adminisrator will be logged in</li>
                                </div>
                            </details>
                            <details className="bg-slate-800 shadow-lg rounded-lg group m-4 p-4 ease-in-out duration-500">
                                <summary className="list-none flex flex-wrap items-center cursor-pointer
                                focus-visible:outline-none rounded group-open:rounded-b-none group-open:z-[1] relative">
                                <h1 className="flex flex-1 font-semibold text-lg text-blue-300">Admin Dashboard</h1>
                                <div className="flex w-10 items-center justify-center">
                                    <div className="border-8 border-transparent border-l-gray-600 ml-2
                                    group-open:rotate-90 transition-transform origin-left
                                    "></div>
                                </div>
                                </summary>
                                <div className="p-4">
                                    <li>From the Sidebar, adminisrator can access the pages to validate registered users, view voter list, add election and candidates, audit elections, and view results of completed polls</li>
                                    <li>Validate Users : List of registered users is displayed. Check details and validate the user</li>
                                    <li>View Voter List : Check list of all validated users</li>
                                    <li>Add Election : Add an election for voters to participate in</li>
                                    <li>Add Candidates : Add and map a candidate to an added election for voters to vote to</li>
                                    <li>Audit Elections : Activate/De-activate elections, view the candidates mapped to each poll, map voters to the polls individually, and remove elections, once finished</li>
                                    <li>View Results : Check winners of polls that have not been removed from the system yet. Admin can also put their vote to resolve and break ties between candidates here, so as to get one winner for each poll</li>
                                </div>
                            </details>
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    </div>
  )
}

export default Help