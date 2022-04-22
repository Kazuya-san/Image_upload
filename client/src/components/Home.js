import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
let url = "http://localhost:5000";

const Home = () => {
  const [title, settitle] = useState("");
  const [image, setimage] = useState("");
  const [imgUri, setimgUri] = useState("");
  const [allTitles, setallTitles] = useState([]);

  useEffect(() => {
    axios
      .get(url + "/getall")
      .then((res) => {
        if (res.data.length > 0) {
          setallTitles(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getAll = () => {
    axios
      .get(url + "/getall")
      .then((res) => {
        setallTitles(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleImage = (e) => {
    setimage(e);
    //show image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setimgUri(e.target.result);
    };
    reader.readAsDataURL(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);
    axios.post(`${url}/upload`, formData).then((res) => {
      console.log(res);
      if (res.status === 200) {
        setallTitles([...allTitles, { title, image: "uploads/" + image.name }]);
        settitle("");
        setimage("");
        setimgUri("");
      }
    });

    console.log(image);
  };

  return (
    <div>
      <div
        className="Title_container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "100vw",
          width: "95%",
          margin: "auto",
        }}
      >
        <form onSubmit={handleSubmit}>
          <h1>Title</h1>
          <input
            type="text"
            value={title}
            onChange={(e) => settitle(e.target.value)}
            className="Title_input"
          />

          <div
            style={{
              //rounded corners
              borderRadius: "10px",
            }}
          >
            {image && (
              <img
                width={150}
                height={150}
                style={{
                  //rounded corners
                  borderRadius: "50%",
                }}
                src={imgUri}
                alt="title"
              />
            )}
          </div>

          <h1>Image</h1>
          <input
            type="file"
            onChange={(e) => handleImage(e.target.files[0])}
            className="Title_input"
          />
          <button className="submitbtn">Submit</button>
        </form>
      </div>

      <div
        className="allTitles"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
          maxWidth: "100vw",
          width: "95%",
          margin: "auto",
        }}
      >
        {allTitles.map((title) => (
          <div
            className="title_container"
            key={title._id}
            style={{ margin: "10px" }}
          >
            <Link to={`/update/${title._id}`}>
              {" "}
              <h4>{title.title}</h4>
            </Link>
            <img
              width={200}
              height={200}
              src={`${url}/${title.image}`}
              alt="title"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
