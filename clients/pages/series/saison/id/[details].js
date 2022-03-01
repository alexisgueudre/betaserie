import Link from 'next/link'

function seriesSaisonId({seasons, episodes}){
    // console.log(seasons)
    return(
        <>
        {/* {console.log(seasons)} */}
                    {seasons.seasons_details.map((season, n) => 
                    <div key={n}>
                        <p>Saison {season.number}</p>
                        {
                        episodes.episodes.map((episode, i) =>
                        <div key={i}>
                            {season.number == episode.season?<Link href={`/series/saison/episodes/id/${episode.episode}`}>
                                <a>
                                    Episode {episode.episode}
                                </a>
                            </Link>:null}
                        </div> )
                        
                        
                        }
                    </div> )}
                    {/* {console.log(episodes)} */}
        </>
    )
}

export async function getServerSideProps ({params}) {
    console.log('params : ');
    console.log(params);
    
    const seasons = await fetch(`https://api.betaseries.com/shows/display?key=1c4e4df8e983&id=${params.details}`)
    .then(r => r.json()).then(e=>e.show)
    // console.log(seasons);
    // console.log(`${seasons.thetvdb_id}`)
    const episodes = await fetch(`https://api.betaseries.com/shows/episodes?key=1c4e4df8e983&thetvdb_id=${seasons.thetvdb_id}`)
    .then(r => r.json())
    // console.log(episodes);


    
    if (!seasons) {
        return {
            notFound: true,
        }
    }
    else{
        // console.log(seasons);
        return {
            props:{
                seasons,
                episodes
            }
        }
    }

}

export default seriesSaisonId;