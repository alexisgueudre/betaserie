import React from 'react'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie';

async function data(code) {
    const [cookies, setCookie, removeCookie] = useCookies(['userToken']);
    const router = useRouter();
    const form = new FormData()
    const apiKey = "1c4e4df8e983";
    const redirect = "http://localhost:3000/user/login";
    const apiSecret = "22e6b34f978b172aabcb0a0b74af1682";

    form.append("client_id",apiKey )
    form.append("client_secret", apiSecret )
    form.append("redirect_uri",redirect )
    form.append("code", code )

    const data = await fetch("https://api.betaseries.com/oauth/access_token", {
        method: "post",
        headers: {
            "X-BetaSeries-Key" : "1c4e4df8e983"
            },
        body : form
    });
    const response = await data.json();
    setCookie("userToken",response,{path: "/", maxAge : 3600*12})
    router.push("/")
};

export default function Login() {

    const router = useRouter();
    const code = router.query.code;
    if (code === undefined || code === null) {
        return false
    } else {
        data(code)
    };


    return (
        <div>

        </div>
    )
}