import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";

const FeelingScreen = ({ route, navigation }) => {
  const { selectedDate } = route.params;
  const [selectedValues, setSelectedValues] = useState({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  });

  const [activeButton, setActiveButton] = useState(null);
  const [activeFirstSubtype, setActiveFirstSubtype] = useState(null);

  const buttonNames = ["Joy", "Fear", "Love", "Anger", "Sadness", "Surprise"];

  const dropdownOptions = {
    0: ["Happy", "Cheerful", "Proud", "Optimistic", "Enthusiastic", "Elation", "Enthralled"],
    1: ["Horror", "Nervous", "Insecure", "Terror", "Scared"],
    2: ["Peaceful", "Tenderness", "Desire", "Longing", "Affectionate"],
    3: ["Disgust", "Envy", "Rage", "Irritable", "Exasperated"],
    4: ["Suffering", "Sadness", "Disappointed", "Shameful", "Neglected", "Despair"],
    5: ["Stunned", "Confused", "Amazed", "Overcome", "Moved"],
  };

  const finalOptions = {
    0: {
      Happy: ["Amused", "Delighted"],
      Cheerful: ["Jovial", "Blissful"],
      Proud: ["Triumphant", "Illustrious"],
      Optimistic: ["Hopeful", "Eager"],
      Enthusiastic: ["Zeal", "Excited"],
      Elation: ["Jubilation", "Euphoric"],
      Enthralled: ["Rapture", "Enchanted"],
    },
    1: {
      Horror: ["Dread", "Mortified"],
      Nervous: ["Nervous", "Scared"],
      Insecure: ["Inadequate", "Inferior"],
      Terror: ["Hysterical", "Panic"],
      Scared: ["Helpless", "Frightened"],
    },
    2: {
      Peaceful: ["Satisfied", "Relieved"],
      Tenderness: ["Compassionate", "Caring"],
      Desire: ["Infatuation", "Passion"],
      Longing: ["Attracted", "Sentimental"],
      Affectionate: ["Fondness", "Romantic"],
    },
    3: {
      Disgust: ["Contempt", "Revolted"],
      Envy: ["Resentful", "Jealous"],
      Rage: ["Hostile", "Hate"],
      Irritable: ["Aggravated", "Annoyed"],
      Exasperated: ["Frustrated", "Agitated"],
    },
    4: {
      Suffering: ["Agony", "Hurt"],
      Sadness: ["Depressed", "Sorrow"],
      Disappointed: ["Dismayed", "Displeased"],
      Shameful: ["Regretful", "Guilty"],
      Neglected: ["Isolated", "Lonely"],
      Despair: ["Grief", "Powerless"],
    },
    5: {
      Stunned: ["Shocked", "Dismayed"],
      Confused: ["Disillusioned", "Perplexed"],
      Amazed: ["Astonished", "Awe-Struck"],
      Overcome: ["Speechless", "Astounded"],
      Moved: ["Stimulated", "Touched"],
    },
  };

  const toggleSelection = (buttonIndex, item) => {
    setSelectedValues((prev) => {
      const isSelected = prev[buttonIndex].includes(item);
      const updatedSelection = isSelected
        ? prev[buttonIndex].filter((option) => option !== item)
        : [...prev[buttonIndex], item];
      return { ...prev, [buttonIndex]: updatedSelection };
    });
    setActiveFirstSubtype(item); // Update selected first subtype
  };

  const handleConfirm = () => {
    // Navigate to FinalScreen with selectedValues and selectedDate
    navigation.navigate("FinalScreen", { selectedValues, selectedDate });
  };
  

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Date Row */}
        <View style={styles.dateRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.date}>{formatDate(new Date(selectedDate))}</Text>
        </View>

        {/* Render buttons and dropdowns */}
        {buttonNames.map((buttonName, index) => {
          if (activeButton === index || activeButton === null) {
            return (
              <View key={index} style={styles.buttonContainer}>
                {/* Button */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    setActiveButton(activeButton === index ? null : index)
                  }
                >
                  <Text style={styles.buttonText}>{buttonName}</Text>
                </TouchableOpacity>

                {/* Dropdowns */}
                {activeButton === index && (
                  <View style={styles.dropdownContainer}>
                    {/* First dropdown */}
                    <FlatList
                      data={dropdownOptions[index]}
                      keyExtractor={(item, idx) => idx.toString()}
                      renderItem={({ item }) => {
                        const isSelected = selectedValues[index].includes(item);
                        const isActiveSubtype = activeFirstSubtype === item;

                        return (
                          <View>
                            {/* First Dropdown Item */}
                            <TouchableOpacity
                              style={[
                                styles.dropdownItem,
                                isSelected && styles.selectedItem,
                              ]}
                              onPress={() => toggleSelection(index, item)}
                            >
                              <Text style={styles.dropdownItemText}>
                                {item} {isSelected ? "✔" : ""}
                              </Text>
                            </TouchableOpacity>

                            {/* Second Dropdown for Selected Item */}
                            {isActiveSubtype && finalOptions[index][item] && (
                              <FlatList
                                data={finalOptions[index][item]}
                                keyExtractor={(subItem, subIdx) =>
                                  subIdx.toString()
                                }
                                renderItem={({ item: subItem }) => (
                                  <TouchableOpacity
                                    style={styles.subDropdownItem}
                                    onPress={() =>
                                      toggleSelection(index, subItem)
                                    }
                                  >
                                    <Text style={styles.subDropdownItemText}>
                                      {subItem}
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              />
                            )}
                          </View>
                        );
                      }}
                    />
                  </View>
                )}
              </View>
            );
          }
          return null; // Render nothing if the button isn't active
        })}

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    alignItems: "center",
  },
  dateRow: {
    flexDirection: "row",
    width: "100%",
    height: 60,
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 30,
    gap: 15,
    backgroundColor: "#e3f2fd",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#0288d1",
    alignItems: "center",
    elevation: 3,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
  },
  date: {
    fontSize: 20,
    color: "#6200EE",
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#6200EE",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedItem: {
    backgroundColor: "#E0F7FA",
    borderColor: "#26C6DA",
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownItemText: {
    fontSize: 14,
  },
  subDropdownItem: {
    padding: 10,
    backgroundColor: "#F1F8E9",
    marginTop: 5,
    borderRadius: 5,
    marginLeft: 20,
  },
  subDropdownItemText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#6200EE",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FeelingScreen;
