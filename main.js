// the api we will test is 'https://jsonplaceholder.typicode.com/'

// AXIOS GLOBALS
// get jwt from https://jwt.io/
// it attaches to whatever request you make
axios.defaults.headers.common['X-Auth-Token'] = 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

// GET REQUEST version 1 - long version
// function getTodos() {
//   axios({          // it returns a promise
//     method: 'get',
//     url: 'https://jsonplaceholder.typicode.com/todos',
//     params: {
//       _limit: 5 // equivalent to adding the url the '?_limit=5'
//     }
//   })
//   .then(res => showOutput(res))
//   .catch(err => console.error(err))
// }

// GET REQUEST version 2 - short version
function getTodos() {
  axios
  .get('https://jsonplaceholder.typicode.com/todos?_limit=5', { timeout: 5000 }) // the timeout (in miliseconds) will cancel a 'stuck' request
  .then(res => showOutput(res))
  .catch(err => console.error(err))
}

// POST REQUEST
function addTodo() {
  axios
  .post('https://jsonplaceholder.typicode.com/todos', {
    title: 'New Todo',
    completed: false
  })
  .then(res => showOutput(res))
  .catch(err => console.error(err))
}

// PUT/PATCH REQUEST    (Put replaces an element of data completely, where patch just adjusts parts of it)
function updateTodo() {
  axios
  .put('https://jsonplaceholder.typicode.com/todos/1', { // put can be replaced with patch and then this data 
                                                         // element is just adjusted and not replaced
    title: 'Updated Todo',
    completed: true
  })
  .then(res => showOutput(res))
  .catch(err => console.error(err))
}

// DELETE REQUEST
function removeTodo() {
  axios
  .delete('https://jsonplaceholder.typicode.com/todos/1')
  .then(res => showOutput(res))
  .catch(err => console.error(err))
}

// SIMULTANEOUS DATA
function getData() {
  axios
  .all([  
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
    axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
  ]) 
  //  .then(res => showOutput(res[0])) // could also be res[1] as there are 2 elements to this response
  .then(axios.spread((todos, posts) => showOutput(posts)))
   .catch(err => console.error(err))
}

// CUSTOM HEADERS
// suppose you need authorization to perform 'post' requests
function customHeaders() { 
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'sometoken' // some JWT (json web token)
    }
  }
  
  axios
  .post('https://jsonplaceholder.typicode.com/todos', {
    title: 'New Todo',
    completed: false
  }, config)
  .then(res => showOutput(res))
  .catch(err => console.error(err))
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  const options = {
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: {
      title: 'hellow world'
    },
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.title = data.title.toUpperCase()
      return data 
    })
  }
  
  axios(options)
  .then(res => showOutput(res))
  .catch(err => console.error(err))
}

// ERROR HANDLING
function errorHandling() {
  axios
    .get('https://jsonplaceholder.typicode.com/todoss', {
      validateStatus: function(status) {
        return status <= 50 // this way, only status above 500 will trigger the regect (and the catch)
      }
    }) 
    .then(res => showOutput(res))
    .catch(err => {
      if (err.response) {
        // server responded with a status other than 200 range
        console.log(err.response.data) 
        console.log(err.response.status)
        console.log(err.response.headers)

        if (err.response.status === 404) {
          alert('Error: Page Not Found')
        } else if (err.request) {
          // request was made but no response
          console.error(err.request)
        } else {
          console.error(err.message)
        }
      }
    })
}

// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source()
  
  axios
  .get('https://jsonplaceholder.typicode.com/todos', {
    cancelToken: source.token
  }) 
  .then(res => showOutput(res))
  .catch(thrown => {
    if (axios.isCancel(thrown)) {
      console.log('Request canceled', thrown.message)
    }
  })

  condition_to_cancel_request = true // change it to a condition that you want
  if (condition_to_cancel_request) { // how can it cancel a request that was submitted earlier? because the request action is asyncronous
                                     // and if it wasn't completed before we cancel it here then it is relevant
    source.cancel('Request canceled!')
  }
}

// AXIOS INSTANCE
function axiosInstance() {
  const axios_instance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com'
    // more custom settings
  })
  
  axios_instance.get('/todos')
  .then(res => showOutput(res))
  .catch(err => console.error(err))

}

// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use( // this will be triggered automatically when sendind any request
  config => { // we could choose other fields of the request, like data
    console.log(
      `${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().getTime()}`
    )

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
document.getElementById('instance').addEventListener('click', axiosInstance);

// // AXIOS GLOBALS
// axios.defaults.headers.common['X-Auth-Token'] =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// // GET REQUEST
// function getTodos() {
//   // axios({
//   //   method: 'get',
//   //   url: 'https://jsonplaceholder.typicode.com/todos',
//   //   params: {
//   //     _limit: 5
//   //   }
//   // })
//   //   .then(res => showOutput(res))
//   //   .catch(err => console.error(err));

//   axios
//     .get('https://jsonplaceholder.typicode.com/todos?_limit=5', {
//       timeout: 5000
//     })
//     .then(res => showOutput(res))
//     .catch(err => console.error(err));
// }


// // POST REQUEST
// function addTodo() {
//   axios
//     .post('https://jsonplaceholder.typicode.com/todos', {
//       title: 'New Todo',
//       completed: false
//     })
//     .then(res => showOutput(res))
//     .catch(err => console.error(err));
// }


// // PUT/PATCH REQUEST
// function updateTodo() {
//   axios
//     .patch('https://jsonplaceholder.typicode.com/todos/1', {
//       title: 'Updated Todo',
//       completed: true
//     })
//     .then(res => showOutput(res))
//     .catch(err => console.error(err));
// }

// // DELETE REQUEST
// function removeTodo() {
//   axios
//     .delete('https://jsonplaceholder.typicode.com/todos/1')
//     .then(res => showOutput(res))
//     .catch(err => console.error(err));
// }

// // SIMULTANEOUS DATA
// function getData() {
//   axios
//     .all([
//       axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
//       axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
//     ])
//     .then(axios.spread((todos, posts) => showOutput(posts)))
//     .catch(err => console.error(err));
// }

// // CUSTOM HEADERS
// function customHeaders() {
//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: 'sometoken'
//     }
//   };

//   axios
//     .post(
//       'https://jsonplaceholder.typicode.com/todos',
//       {
//         title: 'New Todo',
//         completed: false
//       },
//       config
//     )
//     .then(res => showOutput(res))
//     .catch(err => console.error(err));
// }

// // TRANSFORMING REQUESTS & RESPONSES
// function transformResponse() {
//   const options = {
//     method: 'post',
//     url: 'https://jsonplaceholder.typicode.com/todos',
//     data: {
//       title: 'Hello World'
//     },
//     transformResponse: axios.defaults.transformResponse.concat(data => {
//       data.title = data.title.toUpperCase();
//       return data;
//     })
//   };

//   axios(options).then(res => showOutput(res));
// }

// // ERROR HANDLING
// function errorHandling() {
//   axios
//     .get('https://jsonplaceholder.typicode.com/todoss', {
//       // validateStatus: function(status) {
//       //   return status < 500; // Reject only if status is greater or equal to 500
//       // }
//     })
//     .then(res => showOutput(res))
//     .catch(err => {
//       if (err.response) {
//         // Server responded with a status other than 200 range
//         console.log(err.response.data);
//         console.log(err.response.status);
//         console.log(err.response.headers);

//         if (err.response.status === 404) {
//           alert('Error: Page Not Found');
//         }
//       } else if (err.request) {
//         // Request was made but no response
//         console.error(err.request);
//       } else {
//         console.error(err.message);
//       }
//     });
// }

// // CANCEL TOKEN
// function cancelToken() {
//   const source = axios.CancelToken.source();

//   axios
//     .get('https://jsonplaceholder.typicode.com/todos', {
//       cancelToken: source.token
//     })
//     .then(res => showOutput(res))
//     .catch(thrown => {
//       if (axios.isCancel(thrown)) {
//         console.log('Request canceled', thrown.message);
//       }
//     });

//   if (true) {
//     source.cancel('Request canceled!');
//   }
// }

// // INTERCEPTING REQUESTS & RESPONSES
// axios.interceptors.request.use(
//   config => {
//     console.log(
//       `${config.method.toUpperCase()} request sent to ${
//         config.url
//       } at ${new Date().getTime()}`
//     );

//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

// // AXIOS INSTANCE
// const axiosInstance = axios.create({
//   // Other custom settings
//   baseURL: 'https://jsonplaceholder.typicode.com'
// });
// // axiosInstance.get('/comments').then(res => showOutput(res));

// // Show output in browser
// function showOutput(res) {
//   document.getElementById('res').innerHTML = `
//   <div class="card card-body mb-4">
//     <h5>Status: ${res.status}</h5>
//   </div>

//   <div class="card mt-3">
//     <div class="card-header">
//       Headers
//     </div>
//     <div class="card-body">
//       <pre>${JSON.stringify(res.headers, null, 2)}</pre>
//     </div>
//   </div>

//   <div class="card mt-3">
//     <div class="card-header">
//       Data
//     </div>
//     <div class="card-body">
//       <pre>${JSON.stringify(res.data, null, 2)}</pre>
//     </div>
//   </div>

//   <div class="card mt-3">
//     <div class="card-header">
//       Config
//     </div>
//     <div class="card-body">
//       <pre>${JSON.stringify(res.config, null, 2)}</pre>
//     </div>
//   </div>
// `;
// }

// // Event listeners
// document.getElementById('get').addEventListener('click', getTodos);
// document.getElementById('post').addEventListener('click', addTodo);
// document.getElementById('update').addEventListener('click', updateTodo);
// document.getElementById('delete').addEventListener('click', removeTodo);
// document.getElementById('sim').addEventListener('click', getData);
// document.getElementById('headers').addEventListener('click', customHeaders);
// document
//   .getElementById('transform')
//   .addEventListener('click', transformResponse);
// document.getElementById('error').addEventListener('click', errorHandling);
// document.getElementById('cancel').addEventListener('click', cancelToken);
