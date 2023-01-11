import { useRouter } from "next/router";
import { useEffect } from "react"

export default function TestRouter(params) {
    const router = useRouter();
    const { hash } = router.query;

    useEffect(() => {
        // console.log(hash);
        console.log(router);
        console.log(router.asPath.split('?'));
    },[hash])

    return <h1>TestRouter</h1>
}