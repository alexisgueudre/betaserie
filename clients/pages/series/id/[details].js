import Link from "next/link"
import React from "react";
import Seasons from "../../components/Seasons"
import Home from '../../index'
import { parseCookies } from "../../helpers"
import { useState, useEffect } from "react";

export default function seriesId({ user,token }) {

    const [series,setSerie] = useState(null)
    const [msg, setMsg] = useState("");

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

     useEffect(async () => {
        if (serie == null ){
            const data = await fetch(`https://api.betaseries.com/shows/display?id=${params.idSerie}&key=1c4e4df8e983`, {
                method: "get",
                headers: {
                    "X-BetaSeries-Key": "1c4e4df8e983"
                },
            });
            const response = await data.json();
            setSerie(response)
    }
    }, [])
     if (series !== undefined && series!== null) {
        var serie = series.show
        if (serie.id !== undefined && serie.id !== null) {
            return (
                <>
                    <Home />
                    <div className="col-12">
                        <img width="100%" className="height-banner" src={serie.images.banner} />
                    </div>
                    <div className="pt-4 container-fluid text-center  banner-separate pb-4 ">
                        <div className=" col-12 row">
                              <Link href="/series"><a className="col-3">Revenir à l'accueil</a></Link>
                            <h1 className="col-6">{serie.title}</h1>
                            <a className="col-3" onClick={(event) => (archiveSerie(event,token,serie.id,setMsg))}>Archiver la série</a>
                            <li>{msg}</li>

                        </div>

                        <div className="container-fluid">
                            <div className=" col-12 pt-3  d-flex row">
                                <ul className="col-4 row">
                                    <li className="col-12">Synopsis : {serie.description}</li>
                                </ul>
                                <ul className="col-4">
                                    <li className="col-12">Nombre de saisons : {serie.seasons}</li>
                                    <li className="col-12 pt-3 pb-3">Nombre d'épisodes : {serie.episodes}</li>
                                    <li className="col-12">Note : {serie.notes.mean.toFixed()}</li>
                                </ul>
                                <ul className="col-4 d-flex">
                                    <h5 className="col-2">Genres :</h5>
                                    {Object.values(serie.genres).map((genre, n) => <li className="col-2" key={n}>{genre}</li>)}
                                </ul>
                            </div>
                        </div>
                        <div className="col-12 pt-3">
                            <div className="col-12 text-center button-saison">
                            <Seasons id={serie.id} img={serie.images.show}/>

                            </div>
                            </div>
                    </div>
                </>
            )
        }
     }else
     {
         return(
         <></>
         )
     }
}

async function archiveSerie(event, token, serieId,setMsg) {
    if (event) {
        const archive = await fetch(`https://api.betaseries.com/shows/archive?id=${serieId}&access_token=${token}`, {
            method: "post",
            headers: {
                "X-BetaSeries-Key": "1c4e4df8e983"
            },
        });
        const response = await archive.json();
        console.log(response)
        if (response !== undefined) {
            setMsg(`serie archives`)
        }else
        {
            setMsg(`echec de larchivage de la serie peut etre ne l'aver vous pas dans votre liste`)
        }
    }
}

seriesId.getInitialProps = async ({ req, res }) => {


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

    const infoFetch = await fetch(`https://api.betaseries.com/members/infos?access_token=${dataToken.access_token}`, {
        method: "get",
        headers: {
            "X-BetaSeries-Key": "1c4e4df8e983",
        },
    });
    const infoData = await infoFetch.json();

    return {
        token:dataToken.access_token,
        user: infoData.member,
    }
}


