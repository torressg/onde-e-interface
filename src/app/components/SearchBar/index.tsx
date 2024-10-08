"use client";

import React, { useEffect, useState } from "react";
import { LocalStorageService } from "../../../services/LocalStorageService";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { fetchAmbientes } from "@/services/dbAmbientes";
import AutoCompleteList from "./AutoCompleteList";
import ModalStartLocation from "./modalStartLocation"; // Importando o modal

const SearchBar: React.FC<{
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  onSearch: (startNode: string, endNode: string) => void;
}> = ({ inputValue, setInputValue, onSearch }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [suggestionsList, setSuggestionsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const removeAutoComplete = () => {
    setTimeout(() => setFilteredSuggestions([]), 200);
  };
  const [endNode, setEndNode] = useState(""); // Novo estado para o ponto final/endNode
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal

  useEffect(() => {
    const loadAmbientes = async () => {
      setLoading(true);
      try {
        const data = await fetchAmbientes();
        const verifyData = data.filter(
          (i: any) => i.nome !== "NADA" && i.nome.trim() !== ""
        );
        const names = verifyData.map((ambiente: any) => ambiente.nome);
        setSuggestionsList(names);
      } catch (error) {
        console.error("Erro ao carregar ambientes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAmbientes();
  }, []);

  const handleCombinedClick = () => {
    if (inputValue.trim()) {
      const matchingSuggestion = suggestionsList.find(
        (suggestion) =>
          suggestion.toLowerCase() === inputValue.toLowerCase().trim()
      );

      if (matchingSuggestion) {
        setEndNode(matchingSuggestion);
        setIsModalOpen(true);
      } else {
        toast({
          title: "Ambiente não encontrado.",
          description: "Por favor, verifique o nome e tente novamente.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    setEndNode(value.toLowerCase());

    if (value) {
      const filtered = suggestionsList.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Evita o comportamento padrão do formulário
      setFilteredSuggestions([]);
      handleCombinedClick(); // Chama a função combinada ao pressionar Enter
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setEndNode(suggestion); // Define a sugestão clicada como o endNode
    setFilteredSuggestions([]); // Remove sugestões após o clique
  };

  // Função que será chamada quando o usuário confirmar o ponto de partida no modal
  const handleConfirmStartNode = (startNode: string) => {
    LocalStorageService.setRecentDestination(endNode);
    setIsModalOpen(false); 
    setInputValue("");
    onSearch(startNode, endNode);
  };

  return (
    <Box position="relative" width="100%">
      <InputGroup size="md" className="w-80" style={{ zIndex: 1 }} >
        <InputLeftElement pointerEvents="none" height="100%" display="flex">
          <SearchIcon color="#F8A801" w="2rem" h="2rem" pl="0.813rem" />
        </InputLeftElement>
        <Input
          placeholder="Para onde?"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={removeAutoComplete}
          type="search"
          enterKeyHint="go"
          bg="#1c1c1c"
          borderRadius="30px"
          boxShadow="0 4px 10px rgba(0, 0, 0, 0.3)"
          pl="3rem"
          className="w-80 h-12"
          border="1.5px solid"
          borderColor="#F8A801"
          focusBorderColor="#F8A801"
          _placeholder={{ color: "#474747" }}
          color="white"
        />
        {inputValue && (
          <InputRightElement width="3rem" height="100%" display="flex">
            <div onClick={handleCombinedClick} style={{ cursor: "pointer" }}>
              <ArrowForwardIcon color="#F8A801" w="24px" h="24px" />
            </div>
          </InputRightElement>
        )}
      </InputGroup>
      {filteredSuggestions.length > 0 && (
        <div className="flex justify-center">
          <AutoCompleteList
            suggestions={filteredSuggestions}
            onSelect={handleSuggestionClick}
            className="w-4/5"
          />
        </div>
      )}

      {/* Chamando o ModalStartLocation e passando os dados */}
      <ModalStartLocation
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        destino={endNode}
        startOptions={["Entrada", ...suggestionsList.filter((sug) => sug !== endNode)]}
        onConfirm={handleConfirmStartNode}
      />
    </Box>
  );
};

export default SearchBar;
