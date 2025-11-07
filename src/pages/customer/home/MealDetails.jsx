import { useParams } from "react-router-dom";
import { Box,Text} from "@chakra-ui/react";


const MealDetails = () => {
  const { chefId, mealId } = useParams();
 
  return (
    <Box p={4} mx="auto">
      <Text>Meal Details</Text>
    </Box>
  );
};

export default MealDetails;
