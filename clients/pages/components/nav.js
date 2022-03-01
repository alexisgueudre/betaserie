import React from 'react'
import Link from "next/link"
import { useState } from "react";

export default function nav() {
    const [search, setSearch] = useState("");
    const handleSearch = (event) => {
        const value = event.target.value;
        setSearch(value);
    }
    const key = "1c4e4df8e983"
    const redirect = "http://localhost:3000/user/login"
    return (
        <div>
            <nav className="pt-4 pb-4 banner-separate container-fluid">
                    <div className='col-12 row'>
                        <div className="col-2">
                            <Link href={`http://localhost:3000/`} ><a aria-current="page">Manga Times</a></Link>
                        </div>
                        <div className="col-6 d-flex search">
                            <input type="search" onChange={handleSearch} placeholder="searchSeries" className=" form-control search-rounded" />
                            <div className="mx-4">
                            <i type="button" className="fas fa-search pt-2"></i>
                            </div>
                        </div>
                        <div className="col-2 text-center">
                            <Link href={`http://localhost:3000/`} ><a aria-current="page"><i className="fas fa-home"></i></a></Link>
                        </div>
                        <div className="col-1">
                            <Link href={`https://www.betaseries.com/authorize?client_id=${key}&redirect_uri=${redirect}`}><a><i className="fas fa-sign-in-alt"></i></a></Link>
                        </div>
                        <div className="col-1">
                            <Link href={`http://localhost:3000/user/profile`}><a><i className="fas fa-user-alt"></i></a></Link>
                        </div>
                    </div>
            </nav>
        </div>

    )
}




nav.getInitialProps = async ({ }) => {
    const dataMembers = await fetch(`https://api.betaseries.com/members/search?login=${searchData}`, {
        method: "get",
        headers: {
            "X-BetaSeries-Key": "1c4e4df8e983",
        },
    });
    const dataMember = await infoFetch.json();
}