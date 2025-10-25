# Project Iterations

1. MVP (Complete Oct 24)
   - User is able to edit parameters on the frontend for the 10/50 MA strategy. The backtesting is completed and reported back to the user. 
2. Select different strategies (Due Oct 26)
   - Multiple strategies are manually added to the backend before program runs
   - User is able to select a strategy 
   - The strategy can then be backtested with inputted parameters
   - **NOTE:** Once this step is complete, start making issues and tracking work. This will avoid the potential of breaking the code. 
   **2.1**: Persist the backtesting objects (don't just place in store). These can be moved to a db or on the file system. 
3. Upload strategy file
   - User is able to upload the a strategy with file upload
   - The strategy is sent and compiled in the backend. 
   - The user can then set parameters and backtest the strategy. 
4. Final Product
   - The user is able to enter a strategy in a text editor
5. Production ready
   - Add sign in
   - Containerize 
   - Configure for deployment
6. FUTURE
   - Add CI/CD pipeline including unit testing, ftesting, etc

## Step breakdowns

### Step 1

Complete: Planning began after this step was complete.

### Step 2

#### Frontend

Frontend needs to be overhauled to represent what is shown in the /UX folder. This includes: 
   - Backtesting configurations are represented in the table
   - View results in their own dialog
   - Add then select strategies in dialog

#### Backend

Add the necessary endpoints. This includes: 
   - /strategies: GET and POST: Select the strategy and create a strategy object (to be selected later and have parameters passed to)
   - /backtest/list: GET List all the backtesting options with id's associated with strategies.
   - /backtest/{id}: GET -> get the results; POST -> Start with parameters passed to it.     

Remove the need to fetch a csv, we should only need to store in object for temporary use for now.  

