import React from "react";
import { Box, Typography } from "@mui/material";
import { AutoAwesome, Close } from "@mui/icons-material";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

export const Sidebar = (props) => {

  return (
    <div>
      <Box
        className="recipesContainer"
        width="30vw"
        height="100vh"
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
        alignItems={"center"}
        gap={2}
        overflow={"scroll"}
      >
        <div className="recipeTitle">
          <h1>Recipe Suggestions!</h1>
          <AutoAwesome className="recipeSparkleIcon" fontSize="large"></AutoAwesome>
        </div>
        <p>Click "Generate Ideas" to get started!</p>
        <p>Response: {props.generatedRecipe}</p>
      </Box>
    </div>
  );
};
