import React from 'react'
import Link from 'next/link'
import '../../styles/seriesIndex.module.css'
import Home from '../index'
import { parseCookies } from "../helpers"
import { useState } from "react";

export default function seriesAll ({dataSeries,token})
{
    const [msg, setMsg] = useState("");
    const dataSerie = dataSeries.shows
    console.log(dataSerie)
    if (dataSerie !== undefined && dataSerie !== null ) {
        var mapSeries = dataSerie.map((series) => {
            if (series.images.poster !== undefined && series.images.poster !== null) {
                return (
                    <>
                        <div key={series.id} className="card-series col-4 pb-3 pt-3 ">
                            <div class="card card-size-series banner-separate">
                                <img class="card-img-top" src={series.images.poster} alt="Card image cap" />
                                <div class="card-body  d-flex text-start">
                                <h5 class="card-title">{series.original_title}</h5>
                                <Link href={{pathname:`series/id/${series.id}`, query:{idSerie:series.id}}}><a className=" mx-3">Voir + de details</a></Link>
                                </div>
                                <a className="card-body mx-3" onClick={(event) => (addSeries(event,token,series.id,setMsg))}>ajouter serie</a>

                            </div>
                        </div>
                    </>
                )
            }

        })
    }
    return(
     <>
        <div className='Nav'>
            <Home />
        </div>
        <div className="container">
        {msg}
            <div className="row col-12">

                    {mapSeries}
            </div>
        </div>
    </>
    )
}


async function addSeries(event, token, serieId,setMsg) {
    if (event) {
        const archive = await fetch(`https://api.betaseries.com/shows/show?id=${serieId}&access_token=${token}`, {
            method: "post",
            headers: {
                "X-BetaSeries-Key": "1c4e4df8e983"
            },
        });
        const response = await archive.json();
        console.log(response)
        if (response.show) {
            setMsg(`ajout de la serie en favorie`)
        }else
        {
            setMsg(`echec de lajout de la serie`)
        }
    }
}


seriesAll.getInitialProps = async({req,res})=>
{

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

    const fetchSeries = await fetch("https://api.betaseries.com/shows/list?order=popularity&limit=30", {
        method: "get",
        headers: {
            "X-BetaSeries-Key": "1c4e4df8e983",
        },
    });
    const dataSeries = await fetchSeries.json();

    return {
        token:dataToken.access_token,
        dataSeries: dataSeries,
    }
}