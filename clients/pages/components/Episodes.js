import { useEffect, useState } from "react";
import Episode from "./Episode"

function Episodes (props){
    const [episodes, setEpisodes] = useState([]);
    const [details, setDetails] = useState([]);
    // console.log('props Episode: ');
    // console.log(props);

    useEffect(() => {
            fetch(`https://api.betaseries.com/shows/episodes?key=1c4e4df8e983&id=${props.id}`)
            .then(r => r.json()).then((res) => {
                setEpisodes([...res.episodes]);
            })

        }
    ,[]);
    if (episodes) {
        console.log(episodes)
        return (
            <>
            {episodes.map((episode, n) => {
                console.log(episode)
                if (episode.season == props.season && props.handleShow == true){
                return(
                <div key={n}>
                    <p>{episode.title != 'Pas de titre' ? episode.title : 'Episode : '+episode.episode}</p>

                    <Episode episode={episode} details={details} setDetails={setDetails} img={props.img}></Episode>

                </div>

                )
                }
            } )}
            </>
        )
    }
    else{
        return <div>En chargement</div>
    }

}

export default Episodes;