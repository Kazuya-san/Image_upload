import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
let url = "http://localhost:5000";

const UpdateTitle = () => {
  const [title, settitle] = useState("");
  const [image, setimage] = useState("");
  const [imgUri, setimgUri] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${url}/get/${params.id}`).then((res) => {
      settitle(res.data.title);
      setimage(res.data.image);
      setimgUri(url + "/" + res.data.image);
    });
  }, []);

  console.log(imgUri);

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
    axios
      .put(`${url}/update/${params.id}`, formData)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    settitle("");
    setimage("");
    setimgUri("");
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
          <button className="submitbtn">Update</button>
        </form>
      </div>
    </div>
  );
};
export default UpdateTitle;
