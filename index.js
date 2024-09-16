import fetch from 'node-fetch';
// Recommend using node-fetch for those familiar with JS fetch

const COLORS_URL = 'https://nt-cdn.s3.amazonaws.com/colors.json';

/**
 * Retrieves colors JSON from the remote server
 * @returns Promise
 */
const fetchData = async () => {
  try {
    const result = await fetch(COLORS_URL);
    if (!result.ok) {
      throw new Error("ERROR_FETCHING_COLOR_DATA:", result.status);
    }

    return result.json();
  } catch(error) {
    throw error;
  }
};


/**
 * Compares two name strings to determine if one includes the other
 * 
 * @param name string to compare against
 * @param otherName search string for comparison 
 * @returns boolean
 */
const compareNames = (name, otherName) => {
  return name.toLowerCase().includes(otherName.toLowerCase());
};

/**
 * Finds matching hex code in array of colors
 * 
 * @param data color array to search
 * @param hex hex code to search for in data
 * @returns boolean
 */
const findHex = (data, hex) => {
  return data.find(({ hex: currHex }) => {
    return currHex === hex;
  });
};

/**
 * Looks for any matching comp names in an array of color comps
 * 
 * @param comp comps to search
 * @param compName search string for comparison 
 * @returns boolean
 */
const compareCompName = ({ comp }, compName) => {
  return comp.find(({ name: currName }) => {
    // Explicitly using redundant negation to specify the boolean check
    return !!compareNames(currName, compName);
  });
};

/**
 * Fetches colors and filters using a single provided filter
 * 
 * @param name filter for color name
 * @param hex filter for color hex code
 * @param compName filter for complementary color name
 * @param compHex filter for complementary color hex code
 * @returns Promise
 */
const fetchColors = async ({ name, hex, compName, compHex } = {}) => {
  try {
    const data = await fetchData(); 
    
    // Only process specified filter if provided

    if (name) {
      return data.filter(({ name: currName }) => {
        return compareNames(currName, name);
      });
    }
    
    if (hex) {
      const foundColor = findHex(data, hex);

      return [foundColor];
    }
    
    if (compName) {
      return data.filter((color) => {
        return compareCompName(color, compName);
      });
    }
    
    if (compHex) {
      return data.filter(({ comp }) => {
        // Explicitly using redundant negation to specify the boolean check
        return !!findHex(comp, compHex);
      });
    }

    // If no filters are applied, return the full color data array
    return data;
  } catch (error) { 
    throw error;
  }
};

// Leave this here
export default fetchColors;
