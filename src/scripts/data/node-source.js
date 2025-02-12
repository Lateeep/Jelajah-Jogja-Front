import API_ENDPOINT from "../globals/api-endpoint";
import axios from "axios";

class NodeSource {
  static async getNodes() {
    try {
      const response = await axios.get(API_ENDPOINT.GETNODES);
      return response;
    } catch (error) {
      console.error("Error fetching nodes:", error);
      throw error;
    }
  }

  static async getNodeById(id) {
    try {
      const response = await axios.get(API_ENDPOINT.GETNODEBYID(id));
      return response;
    } catch (error) {
      console.error(`Error fetching node with ID ${id}:`, error);
      throw error;
    }
  }

  static async addNode(data) {
    try {
      const response = await axios.post(API_ENDPOINT.ADDNODE, data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      return response;
    } catch (error) {
      console.error("Error adding node:", error);
      throw error;
    }
  }

  static async editNode(id, data) {
    try {
      const response = await axios.put(API_ENDPOINT.EDITNODE(id), data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      return response;
    } catch (error) {
      console.error(`Error editing node with ID ${id}:`, error);
      throw error;
    }
  }

  static async deleteNode(id) {
    try {
      const response = await axios.delete(API_ENDPOINT.DELETENODE(id));
      return response;
    } catch (error) {
      console.error(`Error deleting node with ID ${id}:`, error);
      throw error;
    }
  }
}

export default NodeSource;
