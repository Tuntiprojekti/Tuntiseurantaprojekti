import React, { useEffect, useState } from "react";
import { getDocs, collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../config/firebase';
import { Button } from "@mui/material";

const UserManagement = () => {
  const [userList, setUserList] = useState([]);

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  const usersCollectionRef = collection(db, "Users");

  const getUserList = async () => {
    try {
      const data = await getDocs(usersCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        email: doc.data().Email,
        firstName: doc.data().firstname,
        lastName: doc.data().lastname,
      }));

      setUserList(filteredData);
      console.log(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  const onSubmitUser = async () => {
    try {
      await addDoc(usersCollectionRef, {
        firstName: newUserName,
        email: newUserEmail,
      });
      getUserList();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    try {
      const userDoc = doc(db, "Users", id);
      await deleteDoc(userDoc);
      getUserList();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div>
        {userList.map((user) => (
          <div key={user.id}>
            <h1>{user.firstName}</h1>
            <p>Email: {user.email}</p>
            <Button onClick={() => deleteUser(user.id)}>Delete user</Button>
          </div>
        ))}
      </div>
      <div>
        <h2>Enter new person</h2>
        <input placeholder="name.." onChange={(e) => setNewUserName(e.target.value)} />
        <input placeholder="email.." onChange={(e) => setNewUserEmail(e.target.value)} />
        <Button onClick={onSubmitUser}>Submit</Button>
      </div>
    </div>
  );
};

export default UserManagement;
