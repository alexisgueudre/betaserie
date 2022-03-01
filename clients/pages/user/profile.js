import React from 'react'
import Home from '../index'
import { useState, useEffect } from "react";
//import Link from "next/link"
import { parseCookies } from "../helpers"

export default function profile({ user, dataToken}) {


    const [searchUsers, setSearchUser] = useState("");
    const [dataUsers, setDataUsers] = useState("")
    const [friendsList,setFriendsList] = useState(null)
    const [notifications,setNotifications] = useState(null)
    const [msg, setMsg] = useState("");
    const handleSearchUser = (event) => {
        const value = event.target.value;
        setSearchUser(value);
    }


    //trie pour la search amie avec map et reset du message
    useEffect(async () => {
        if (searchUsers.length >= 2) {
            const data = await fetch(`https://api.betaseries.com/members/search?login=${searchUsers}%`, {
                method: "get",
                headers: {
                    "X-BetaSeries-Key": "1c4e4df8e983"
                },
            });
            const response = await data.json();
            setDataUsers(response)
        }
        else {
            setDataUsers("")
        }
    }, [searchUsers])

    //friendlist
    useEffect(async () => {
            if (friendsList == null ){
            setInterval( async () => {
                const data = await fetch(`https://api.betaseries.com/friends/list?access_token=${dataToken}`, {
                    method: "get",
                    headers: {
                        "X-BetaSeries-Key": "1c4e4df8e983"
                    },
                });
                const response = await data.json();
                setFriendsList(response)
            }, 1000);
        }
        }, [])


   //notification for friends
   useEffect(async () => {
        if (notifications == null) {
        setInterval(async () => {
         const data = await fetch(`https://api.betaseries.com/members/notifications?access_token=${dataToken}&type="friend"`, {
             method: "get",
             headers: {
                 "X-BetaSeries-Key": "1c4e4df8e983"
             },
         });
         const response = await data.json();
         setNotifications(response)
        }, 1000);
    }
    }, [])



    const dataUser = dataUsers.users
    if (dataUser !== undefined && dataUser !== null ) {
        var mapUsers = dataUser.map((user) => {
            return (

                <ul className="row d-flex" key={user.id}>
                    <li className="d-flex">{user.login} <i class="pt-1 mx-3 fas fa-user-plus" onClick={(event) => (addFriend(event, user.id, dataToken, setMsg))}></i></li>
                </ul>
            )
        })
    }
    if (msg.length > 0) {
        setInterval(() => {
            setMsg("")
        }, 5000);
    }

    //mapping friend list

    if (friendsList !== null) {
        const dataFriends = friendsList.users
        if (dataFriends !== undefined && dataFriends !== null) {
            var mapFriends = dataFriends.map((friend)=>{
                return(
                <ul className="p-0 pt-2">
                    <div className="text-start" key={friend.id}>
                    <li className="d-flex p-0">{friend.login} <i class="fas fa-user-slash mx-3" onClick={(event) => (blockFriend(event, friend.id, dataToken, setMsg))}></i><i class="fas fa-times" onClick={(event) => (deleteFriend(event, friend.id, dataToken, setMsg))}></i></li>
                    </div>
                </ul>
                )
            })
        }
    }

    if (notifications !== null) {
        const dataRequest = notifications.notifications
        if (dataRequest !== undefined && dataRequest !== null ) {
            var mapFriendsRequest = dataRequest.map((friendRequest)=>{
                if (friendRequest.type == "friend") {
                    return(
                        <ul className="p-0 pt-2">
                            <div className="text-start" key={friendRequest.id}>
                            <li className="d-flex p-0">{friendRequest.text} <i class="fas fa-user-plus mx-3" onClick={(event) => (addFriend(event, friendRequest.ref_id, dataToken, setMsg))}></i><i class="fas fa-times" onClick={(event) => (deleteFriend(event, friendRequest.ref_id, dataToken, setMsg))}></i></li>
                            </div>
                        </ul>
                        )
                }
            })
        }
    }
    return (
        <>
            <div className='Nav'>
                <Home />
            </div>
            <section className="col-12 ">
                <img width='100%' className="height-banner" src={user.profile_banner}></img>
            </section>
            <div className="pt-4 container-fluid searchFriend banner-separate pb-4 ">
                <div className="col-6  d-flex ">
                    <input type="search" onChange={handleSearchUser} placeholder="searchFriend" className=" form-control search-rounded" />
                    <div className="mx-4">
                        <i type="button" className="fas fa-search pt-2"></i>
                    </div>
                    <div>
                        <br></br>
                        {mapUsers}
                        <li>{msg}</li>
                    </div>
                </div>
            </div>
            <br></br>
            <section className=" container profile-section">
                <div className="box">
                    <div className=" pt-3 col-12 pt-1 pb-3 row">
                        <div className=" col-4 text-center">
                            <img className="img-profil" src={user.avatar}></img>
                        </div>
                        <div className="col-4 ">
                            <p className="profile-color">{user.login}</p>
                            <p className="profile-color">{user.email}</p>
                            <p className="profile-color">membre depuis : {user.stats.member_since_days} jours</p>
                            <p className="profile-color">inscrit en : {user.subscription}</p>
                        </div>

                        <div className="col-4">
                            <p className="profile-color">episode vue : {user.stats.episodes}</p>
                            <p className="profile-color">nombres d'amis : {user.stats.friends}</p>
                            <p className="profile-color">genre de série préférer : {user.stats.favorite_genre}</p>
                            <p className="profile-color">jour préférer : {user.stats.favorite_day}</p>
                            <p className="profile-color">jour consecutif à voir un épisode : {user.stats.episodes_per_month}</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className=" container profile-section">
            <div className="box">
                    <div className=" pt-3 col-12 pt-1 pb-3 row">
                        <div className=" col-4 text-center">
                            <h5>Demande d'amis recu</h5>
                            {mapFriendsRequest}
                        </div>
                        <div className="col-4 ">
                            <h5>Liste d'amis</h5>
                            {mapFriends}
                        </div>

                        <div className="col-4">
                        <h5></h5>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
async function addFriend(event, idUser, dataToken, setMsg) {
    if (event) {
        const addUsers = await fetch(`https://api.betaseries.com/friends/friend?access_token=${dataToken}&id=${idUser}`, {
            method: "post",
            headers: {
                "X-BetaSeries-Key": "1c4e4df8e983"
            },
        });
        const response = await addUsers.json();
        console.log(response)
        if (response.member !== undefined) {
            setMsg(`votre demande d'amis a bien étais envoiyer a : ${response.member.login}`)
        }else
        {
            setMsg(`votre demande d'amis a bien étais accepter a`)
        }
    }
}
async function deleteFriend(event, idUser, dataToken, setMsg) {
    if (event) {
        const delUsers = await fetch(`https://api.betaseries.com/friends/friend?access_token=${dataToken}&id=${idUser}`, {
            method: "delete",
            headers: {
                "X-BetaSeries-Key": "1c4e4df8e983"
            },
        });
        const response = await delUsers.json();
        console.log(response)
        setMsg(`votre  amis a bien étais suprimée`)
    }
}
async function blockFriend(event, idUser, dataToken, setMsg) {
    if (event) {
        const blockUsers = await fetch(`https://api.betaseries.com/friends/block?access_token=${dataToken}&id=${idUser}`, {
            method: "delete",
            headers: {
                "X-BetaSeries-Key": "1c4e4df8e983"
            },
        });
        const response = await blockUsers.json();
        console.log(response)
        setMsg(`votre amis a bien étais blocker`)
    }
}

profile.getInitialProps = async ({ req, res }) => {

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
    //info useremail
    const emailFetch = await fetch(`https://api.betaseries.com/members/email?access_token=${dataToken.access_token}`, {
        method: "get",
        headers: {
            "X-BetaSeries-Key": "1c4e4df8e983",
        },
    });
    const emailData = await emailFetch.json();


    infoData.member.email = emailData.email

    return {
        user: infoData.member,
        dataToken: dataToken.access_token,
    }
}
