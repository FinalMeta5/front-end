<template>
    <div clas="container">
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>Post Code</th>
                    <th>Address</th>
                    <th>Detail Address</th>
                    <th>Join Date</th>
                    <th>Role</th>
                    <th>Status</th>
                </tr>
        </thead>
        <tbody>
            <tr v-for="member in paginatedMembers" :key="member.memberId">
                <td>{{	member.memberId	}}</td>
                <td>{{	member.email	}}</td>        
                <td>{{	member.name	}}</td>
                <td>{{	member.phone	}}</td>
                <td>{{	member.postCode	}}</td>
                <td>{{	member.address	}}</td>
                <td>{{	member.detailAddress	}}</td>
                <td>{{ new Date(member.joinDate).toLocaleString() }}</td>
                <td>{{	member.role	}}</td>
                <td>{{	member.status	}}</td>
            </tr>
        </tbody>
    </table>

        <!--Pagination Controls-->
        <div class="pagination-controls">
            <button :disabled="currentPage === 1" @click="currentPage--">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button :disabled="currentPage === totalPages" @click="currentPage++">Next</button> 
        </div>
    </div>
</template>


<script>
import axios from 'axios';
export default {
  name : 'MemberListComponent',
data() {
    return {
        members: [],
        currentMember: {},
        currentPage: 1,
        itemsPerPage: 10,
    };
},
computed: {
    totalPages() {
        return Math.ceil(this.members.length/this.itemsPerPage);
    },
    paginatedMembers() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.members.slice(start, end);
    },
},
methods: {
    async fetchData(endpoint, targetProperty) {
        try{
            const response = await axios.get(endpoint);
            this[targetProperty] = response.data;
        } catch(error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
        }
    },
},
mounted() {
    this.fetchData('http://localhost:8080/member/all', 'members');
}
};
</script>



<style>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
.add-employee-button {
  margin-bottom: 20px;
  padding:10px 15px;
  background-color: #4caf50;
  color: white;
  border:none;
  border-radius: 5px;
  cursor: pointer;
}
.add-employee-button:hover {
  background-color: #45a049;
}
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 1000;
  width: 90%;
  max-width: 500px;
}
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.form-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
}
label {
  margin-bottom: 5px;
  font-weight: bold;
}
input, select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap:10px;
}
.btn-primary {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-primary:hover {
  background-color: #0056b3;
}
.btn-secondary {
  padding: 10px 15px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-primary:hover {
  background-color: #5a6268;
}
.pagination-controls {
  margin-top: 20px;
  text-align: center;
}
.pagination-controls button {
  margin: 0 5px;
  padding: 5px 10px;
}
</style>