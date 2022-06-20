import Market from "../views/Market";
import My from "../views/My";
import Publish from "../views/Publish";



export const routes = [
    {
        path:'/',
        element: <Market/>
    },
    {
        path:'/publish',
        element: <Publish />
    },
    {
        path:'/my',
        element: <My />
    }
]