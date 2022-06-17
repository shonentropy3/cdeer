import Market from "../views/Market";
import Publish from "../views/Publish";



export const routes = [
    {
        path:'/',
        element: <Market/>
    },
    {
        path:'/publish',
        element: <Publish />
    }
]