import resort1 from '../imgs/resort1.jpg';
import crane from '../imgs/crane.jpg'; 
import elephant from '../imgs/elephant.webp'; 
import gorilla from '../imgs/gorila.jpg'; 
import lion from '../imgs/lion.jpg'; 
import tourist from '../imgs/tourist.jpg'; 
import giraffe from '../imgs/giraffe.jpg';  
import resort2 from '../imgs/resort2.jpg'; 
import buffalo from "../imgs/buffalo.jpg" ;
import { useState, useEffect, Suspense } from 'react';
import { Await, Form, Link, useLoaderData } from 'react-router-dom';
import { IoPeopleSharp,IoArrowForwardSharp,IoSearchSharp } from "react-icons/io5";
import { FaClockRotateLeft } from "react-icons/fa6";
import Slider from "react-slider"
import { defer } from 'react-router-dom';
import { getSafaris } from '../api';


export function loader()
{
    let loadedSafaris = getSafaris()
    return defer({safaris: loadedSafaris})
}  

export default function Safaris()
{
    const loaderData = useLoaderData()

    const images = [resort1,lion,giraffe,gorilla,resort2,elephant,crane,tourist,buffalo]; 
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Use an async function to fetch and set safaris
        const fetchData = async () => {
          try {
            await loaderData.safaris; // Wait for the Promise to resolve
          } catch (error) {
            console.error('Error fetching safaris:', error);
          }
        };
    
        fetchData(); // Call the async function to fetch data when the component mounts
      }, [loaderData.safaris]);
    // Initialize the current page state
    const [currentPage, setCurrentPage] = useState(1);

    const min = 0;
    const max = 5000;

    const [values, setValues] = useState([min,max])

    useEffect(() => {
      const timer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
      }, 2000); // Change image every 2 seconds
  
      return () => clearTimeout(timer);
    }, [currentIndex]);
    

   // Function to handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const dateFrom = document.querySelector('input[type="date"]').valueAsDate;
    console.log('dateFrom:', dateFrom); 
    const [minValue, maxValue] = values;
    console.log('minValue:', minValue);
    console.log('maxValue:', maxValue);

    try {
      const data = await loaderData.safaris; // Wait for the Promise to resolve
      const filteredSafaris = data.filter((safari) => {
        // Filter by date
        const safariDate = safari.date.toDate();
        if (dateFrom && safariDate < dateFrom) {
          return false;
        }

        // Filter by price range
        return safari.price >= minValue && safari.price <= maxValue;
      });
      console.log('Filtered Safaris:', filteredSafaris);


      renderSafarisElements(filteredSafaris); // Call renderSafarisElements with the filtered data
    } catch (error) {
      console.error('Error fetching safaris:', error);
    }
  };

    function renderSafarisElements(safaris)
    {
        // Define the number of posts to display per page
        const safarisPerPage = 3; // You can adjust this number
        

        // Calculate the start and end indexes of the current page's posts
        const startIndex = (currentPage - 1) * safarisPerPage;
        const endIndex = startIndex + safarisPerPage;

        // Get the current page's posts
        const currentSafaris = safaris.slice(startIndex, endIndex);

        // Calculate the total number of pages
        const totalPages = Math.ceil(safaris.length / safarisPerPage);

        // Function to handle page navigation
        const handlePageChange = (pageNumber) => {
            setCurrentPage(pageNumber);
        };
        
        return(
            <>
                {/* safaris section */}
                <section className='flex justify-center flex-col space-y-5 m-3 mt-44 md:mt-20 lg:mx-48 lg:ml-72'>
                {
                    currentSafaris.map((safari)=>(
                        <div key={safari.id} className='flex justify-center border border-solid rounded-lg lg:h-52'>
                        <div className=''>
                            <img className='rounded-l-lg lg:h-52 sm:h-auto sm:w-auto xsm:h-32 xsm:w-56' src={safari.image}/>
                        </div>
                        <div className='flex flex-col justify-center sm:mx-5 xsm:mx-2'>
                            <h1 className='md:text-xl font-bold xsm:text-sm uppercase'>{safari.title}</h1>
                            <h1>From <span className='text-brightRed font-bold'>${safari.price}</span></h1>
                            <div className='bg-pink-100 rounded-lg flex justify-between md:p-3 xsm:p-1'>
                                <div className='flex justify-between items-center'>
                                    <IoPeopleSharp className='text-brightRed' />
                                    <h1>50</h1>

                                </div>
                                <div className='flex justify-between  items-center text-brightRed'>
                                    <Link to={safari.id}>Explore</Link>
                                    <IoArrowForwardSharp />
                                </div>
                            </div>
                        </div>
                    </div>
                    ))
                }

                
                
            </section>

            {/* Page numbers */}
            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 mx-2 text-blue-600 hover:underline focus:outline-none ${
                    currentPage === index + 1
                        ? 'bg-blue-600 text-yellow-50 rounded-full'
                        : 'bg-white text-blue-600 border border-blue-600 rounded-full'
                    }`}
                >
                    {index + 1}
                </button>
                ))}
            </div>
            </>
        )
    
    }
    
    return (
        <>
            {/* location section */}
            <div
                style={{
                backgroundImage: `url(${images[currentIndex]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '40vh',
                display: 'flex',
                alignItems: 'center',
                }}
                className="relative"
            >
                <div className="text-white text-center mx-auto p-8">
                    <h1 className="text-5xl font-bold mb-4">Our Safaris</h1>
                    <h1 className="text-2xl font-bold mb-4">Explore Uganda</h1>
                </div>
                <Form onSubmit={handleFormSubmit}>
                <div className="absolute flex flex-col md:flex-row justify-between items-center left-4 right-4 -bottom-40  md:left-20 md:right-20 md:-bottom-16 p-4 text-black bg-white rounded-t-lg font-bold">
                    
                        {/* date from section */}
                        <div className='flex items-center space-x-2'>
                            <FaClockRotateLeft className='text-brightRed text-4xl'/>
                            <div className='flex flex-col'>
                                <h1 className='text-gray-400 font-medium'>Date From</h1>
                                <input type='date' />
                            </div>
                        </div>
                        {/* slider scetion */}
                        <div className="flex justify-center items-center">
                            <div className="w-auto p-5 bg-white rounded-lg shadow-sm">                          
                                    <span className={'value'}>${values[0]}-${values[1]}</span>                            
                                <Slider className="slider w-32 md:w-52 h-0.5 bg-blue-100 mt-4" onChange={setValues} value={values} min={min} max={max}/>
                            </div>
                        </div>
                        {/* search button */}
                        <button
                            type='submit'
                            className="flex items-center justify-between md:p-4 xsm:p-3 xsm:px-3 md:px-7 font-bold text-white bg-brightRed rounded-xl baseline hover:shadow-2xl"
                        >
                            <IoSearchSharp className='text-xl'/><span className='text-sm'>SEARCH</span>
                        </button>
                    
                </div>
                </Form>
            </div>
             
            <Suspense fallback={<h1>Loading Safaris...</h1>}>
                <Await resolve={loaderData.safaris}>
                    {renderSafarisElements}
                </Await>
            </Suspense>
        </>
    );
  
}
