import React, { useState, useEffect, Fragment, Component } from "react";

import ReactDOM from "react-dom";
import { BeatLoader } from "react-spinners";
const rootNode = document.querySelector("#root");

const BASE_URL = "https://jsonplaceholder.typicode.com/users";

// Class Components
class DataFetcher extends Component {
  state = {
    posts: [],
    isLoading: false,
    error: null,
  };

  async componentDidMount() {
    this.setState({
      isLoading: true,
    });
    try {
      const res = await fetch(this.props.url);
      if (!res.ok) {
        throw new Error("Error fetching posts!");
      }
      const posts = await res.json();
      this.setState({
        posts,
        isLoading: false,
      });
    } catch (error) {
      this.setState({ error });
    }
  }
  //PROMISE
  //   componentDidMount() {
  //     this.setState({ isLoading: true });
  //     fetch(BASE_URL)
  //       .then(res => {
  //         if (res.ok) {
  //           return res.json();
  //         } else {
  //           throw new Error("Error fetching posts!");
  //         }
  //       })
  //       .then(posts =>
  //         this.setState({
  //           posts,
  //           isLoading: false,
  //         })
  //       )
  //       .catch(error => this.setState({ error }));
  //   }
  render() {
    return this.props.children(this.state);
  }
}

class AppRenderProps extends Component {
  render() {
    return (
      <DataFetcher url={BASE_URL}>
        {({ posts, isLoading, error }) => {
          if (error) {
            return <h1>{error.message}</h1>;
          }
          if (isLoading) {
            return (
              <BeatLoader size={25} color={"#123abc"} loading={isLoading} />
            );
          }
          return (
            <div>
              {posts.map((post) => (
                <Fragment key={post.id}>
                  <h2>{post.name}</h2>
                  <h4>{post.username}</h4>
                  <h6>{post.website}</h6>
                </Fragment>
              ))}
            </div>
          );
        }}
      </DataFetcher>
    );
  }
}
// Hooks
function useDataFetcher(url) {
  const [posts, setPosts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const posts = await res.json();
          setPosts(posts);
          setIsLoading(false);
        } else {
          throw new Error("ki zibbi posts!!");
        }
      } catch (error) {
        setError(error);
      }
    }
    fetchData();
  }, [url]);

  return { posts, isLoading, error };
}
function AppHooks() {
  const { posts, isLoading, error } = useDataFetcher(BASE_URL);

  if (error) {
    return <p style={{ color: "red" }}>{error.message}</p>;
  }

  if (isLoading) {
    return <BeatLoader size={25} color={"#123abc"} loading={isLoading} />;
  }

  return (
    <div>
      {posts.map((post) => (
        <Fragment key={post.id}>
          <h2>{post.name}</h2>
          <h4>{post.username}</h4>
          <h6>{post.website}</h6>
        </Fragment>
      ))}
    </div>
  );
}

ReactDOM.render(<AppHooks />, rootNode);
