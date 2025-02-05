<template>
    <div class="member-container ">
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
@import "../style.css";

.pagination-controls {
  margin-top: 20px;
  text-align: center;
}
.pagination-controls button {
  margin: 0 8px;
  padding: 5px 10px;
}

.member-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  overflow-x: auto;
  justify-content: center;
}
table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  margin: auto;
  max-width: 100%; 
}

th, td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
  white-space: nowrap; 
}
</style>
