"use client";

import "./globals.css";
import { Add, AutoAwesome, PlusOne, Remove } from "@mui/icons-material";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { Sidebar } from "./Sidebar";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemQty, setItemQty] = useState(0);

  const geminiKey = process.env.GEMINI_KEY;
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const [response, setResponse] = useState("");
  const [recipe, setRecipe] = useState("");
  const generatedRecipe = recipe;

  async function recipeAI() {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
    const inventoryItems = inventoryList.map((item) => item.name);
    const prompt = `Generate recipes with everything in this array: ${inventoryItems}.  This dataset is where you can find the names of these ingredients. For each dish, please also provide a list of the exact measurements needed for each ingredient. No need to display ingredients given to you.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    setRecipe(text);
    console.log(recipe);
  }

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const names = [];

  const getItemNames = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    docs.forEach((doc) => {
      names.push(doc.id);
    });
  };

  useEffect(() => {
    getItemNames();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const completelyRemoveItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await deleteDoc(docRef);
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <section className="homeContainer">
      <section className="home">
        <Box
          width={"70vw"}
          height="100vh"
          display={"flex"}
          justifyContent={"center"}
          flexDirection={"column"}
          alignItems={"center"}
          gap={2}
        >
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add Item
              </Typography>
              <Stack width="100%" direction={"row"} spacing={2}>
                <TextField
                  id="outlined-basic"
                  label="Item"
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <button
                  className="addModalButton"
                  onClick={() => {
                    addItem(itemName);
                    setItemName("");
                    handleClose();
                  }}
                >
                  Add
                </button>
              </Stack>
            </Box>
          </Modal>
          <Box
            bgcolor={"#fff"}
            paddingLeft={4}
            paddingRight={4}
            sx={{ borderRadius: 2 }}
          >
            <Box
              width="800px"
              height="100px"
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <h1 className="pantryTitle">Pantry Tracker</h1>
            </Box>
            <div className="searchBar">
              <TextField
                fullWidth
                variant="filled"
                size="small"
                label="Search Pantry"
              >
                Search Bar
              </TextField>
            </div>
            <Stack width="800px" height="300px" spacing={2} overflow={"auto"}>
              {inventory.map(({ name, quantity }) => (
                <Box
                  key={name}
                  width="90%"
                  minHeight="60px"
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  bgcolor={"#f0f0f0"}
                  paddingRight={5}
                  paddingLeft={5}
                  borderRadius={2}
                >
                  <Typography
                    variant={"subtitle1"}
                    color={"#333"}
                    textAlign={"center"}
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <div>
                    <Typography
                      className="quantity"
                      variant={"subtitle1"}
                      color={"#333"}
                      textAlign={"center"}
                    >
                      <button
                        className="quantityButton"
                        onClick={() => removeItem(name)}
                      >
                        <Remove></Remove>
                      </button>
                      <p>{quantity}</p>
                      <button
                        className="quantityButton"
                        onClick={() => addItem(name)}
                      >
                        <Add color="black"></Add>
                      </button>
                    </Typography>
                  </div>
                  <div>
                    <button
                      className="removeButton"
                      onClick={() => completelyRemoveItem(name)}
                    >
                      Remove
                    </button>
                  </div>
                </Box>
              ))}
            </Stack>
          </Box>
          <div>
            <button className="addButton" onClick={handleOpen}>
              Add Item
              <Add className="addIcon"></Add>
            </button>
            <button className="generateButton" onClick={() => recipeAI()}>
              Generate Recipes!
              <AutoAwesome className="sparkleIcon"></AutoAwesome>
            </button>
          </div>
        </Box>
      </section>
      <Sidebar generatedRecipe={generatedRecipe}></Sidebar>
    </section>
  );
}
