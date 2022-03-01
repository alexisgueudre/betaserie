import { useEffect, useState } from "react";
import Season from "../components/Season"

function Seasons (props){
    // console.log('props Seasons: ')
    // console.log(props)
    const [seasons, setSeasons] = useState([]);


    useEffect(() => {
        fetch(`https://api.betaseries.com/shows/display?key=1c4e4df8e983&id=${props.id}`)
        .then(r => r.json()).then((res) => {
           setSeasons(res.show);
        })

    }
    ,[])

    if(seasons.seasons_details != undefined){
        // console.log(seasons)
        // console.log(seasons.seasons_details)

        return (

            seasons.seasons_details.map((seaso, n) =>

                <div key={n}>
                    <Season id={props.id} n={seasons.seasons_details[0].number+n} data={seasons} img={props.img}/>
                </div>
            )
        )
    }
    else{
        return <>En chargement...</>
    }

}

export default Seasons;