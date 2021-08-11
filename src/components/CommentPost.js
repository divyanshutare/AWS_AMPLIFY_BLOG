import React, {Component} from 'react'

class CommentPost extends Component {
    render(){
        const { content, commentOwnerUsername, createdAt } = this.props.commentData
        return (
            <div>
                <span style={{fontStyle: 'italic', color: '#0ca5e297'}}>
                    {"Comment By: "} {commentOwnerUsername}
                    {" on"}
                    <time style={{fontSize: '19px'}}>
                        {" "}
                        {new Date(createdAt).toDateString()}
                    </time>
                </span>
                <p>
                    {content}
                </p>
            </div>
        )
    }
}

export default CommentPost;