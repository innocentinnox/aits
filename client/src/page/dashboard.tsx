import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/auth/login");
      }, [navigate]); // Run only on mount
    return ( <div>
        Dashboard page
    </div> );
}
 
export default Dashboard;