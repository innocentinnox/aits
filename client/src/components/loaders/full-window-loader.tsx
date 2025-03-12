import Loader from "./loader";

const FullWindowLoader = () => {
    return  <div className='absolute inset-0 flex items-center justify-center h-[100vh] w-[100vw]'><Loader/></div>;
}
 
export default FullWindowLoader;