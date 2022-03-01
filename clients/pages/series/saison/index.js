function saisonAll ({seasons}){
    
    console.log(seasons)
    return (
        <>
            <p>tada</p>
            {/* {seasons.seasons.map((season, n) =>{
                <>
                    tada
                    {season.}
                </>
            })} */}
        </>
    )
}

export async function getServerSideProps ({params}) {
    console.log('params : ');
    console.log(params);
    
    const seasons = await fetch(`https://api.betaseries.com/shows/display?key=1c4e4df8e983&id=${params.details}`)
    .then(r => r.json()).then(e=>e.show)
    // console.log(seasons);

    if (!seasons) {
        return {
            notFound: true,
        }
    }
    else{
        console.log(seasons);
        return {
            props:{
                seasons
            }
        }
    }

}

export default saisonAll;