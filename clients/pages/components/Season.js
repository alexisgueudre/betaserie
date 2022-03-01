import { useEffect, useState } from "react";
import Episodes from "./Episodes";
import { parseCookies } from "../helpers"



export default function Season (props){

    const [season, setSeason] = useState([]);
    const [handleShow, setHandleShow] = useState(false);

    useEffect(() => {
        fetch(`https://api.betaseries.com/shows/display?key=1c4e4df8e983&id=${props.id}`)
        .then(r => r.json()).then((res) => {
           setSeason(res.show);
        })

    }
    ,[]);

    console.log('props Season: ')
    console.log(season)

    if(season.seasons_details != undefined){
        // console.log(season)
        // console.log(props.handleShow)
        // console.log(season.seasons_details)

        return (
            <div>
                <a type onClick={() => {
                        if (handleShow == true) setHandleShow(false)
                        else setHandleShow(true)
                    }
                }>
                    saison {props.n}
                </a>

                <Episodes handleShow={handleShow} id={props.id} season={props.n} img={props.img}/>

            </div>
        )
    }
    else{
        return <p>En chargement...</p>
    }

}

Season.getInitialProps = async ({ req, res }) => {

    const data = parseCookies(req)
    if (res) {
        if (Object.keys(data).length === 0 && data.constructor === Object) {
            res.writeHead(301, { Location: "/" })
            res.end()
        }
    }

    if (data) {
        var dataToken = JSON.parse(data.userToken)
    }

    //info user
    const infoFetch = await fetch(`https://api.betaseries.com/members/infos?access_token=${dataToken.access_token}`, {
        method: "get",
        headers: {
            "X-BetaSeries-Key": "1c4e4df8e983",
        },
    });
    const infoData = await infoFetch.json();


    return
    {
        user:infoData
    }
}