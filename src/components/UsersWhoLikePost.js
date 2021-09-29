import React, { Component } from 'react';

class UsersWhoLikePost extends Component {

    render() {
        const allUser = this.props.data
        return allUser.map((user) => {
            return (
                <div key={user}>
                    <span style={{ fontStyle: "bold", color: "#ged" }}>
                        {user}
                    </span>
                </div>
            )
        })
    }
}

export default UsersWhoLikePost