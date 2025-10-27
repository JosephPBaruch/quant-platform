import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { GetBacktest, PostBacktest } from "./Api/Fetch";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { AddStrategy } from "./Components/AddStrategy";
import TextField from "@mui/material/TextField";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { ViewResults } from "./Components/ViewResults";
import { makeStyles } from "@mui/styles";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Backtest } from "./types";

const useStyles = makeStyles((theme: any) => ({
  toolbar: {
    display: "flex",
    gap: theme.spacing ? theme.spacing(2) : 16,
  },
  container: {
    marginTop: theme.spacing ? theme.spacing(4) : 32,
    marginBottom: theme.spacing ? theme.spacing(6) : 48,
  },
  paper: {
    padding: theme.spacing ? theme.spacing(2) : 16,
  },
  sectionHeader: {
    marginBottom: theme.spacing ? theme.spacing(1) : 8,
  },
  divider: {
    marginBottom: theme.spacing ? theme.spacing(2) : 16,
  },
  tableContainer: {
    maxHeight: 520,
  },
  headCell: {
    fontWeight: 600,
  },
  actionsHeader: {
    minWidth: 200,
    fontWeight: 600,
  },
  nameCell: { minWidth: 180 },
  tickerCell: { minWidth: 120 },
  dateCell: { minWidth: 140 },
  incrementCell: { minWidth: 140 },
  cashCell: { minWidth: 140 },
  actionsCell: { minWidth: 200 },
  emptyState: {
    paddingTop: theme.spacing ? theme.spacing(6) : 48,
    paddingBottom: theme.spacing ? theme.spacing(6) : 48,
    textAlign: "center",
    color:
      theme.palette && theme.palette.text
        ? theme.palette.text.secondary
        : "#6b7280",
  },
}));

function App() {
  const [openAddStrategy, setOpenAddStrategy] = useState(false);
  const [tableVals, setTableVals] = useState<Backtest[] | undefined>(undefined);
  const [viewId, setViewId] = useState("");
  const classes = useStyles();

  const fetchData = async () => {
    try {
      const result = await GetBacktest();

      setTableVals(result);
    } catch (err) {
      console.error("Error fetching backtest:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTableCellChange = (
    targetId: string,
    value: string,
    target: string
  ) => {
    setTableVals((prev) =>
      prev
        ? prev.map((item) =>
            item.Id === targetId ? { ...item, [target]: value } : item
          )
        : prev
    );
  };

  const handleParamChange = (
    targetId: string,
    field: string,
    value: string | number
  ) => {
    setTableVals((prev) =>
      prev
        ? prev.map((item) =>
            item.Id === targetId
              ? { ...item, Params: { ...item.Params, [field]: value as any } }
              : item
          )
        : prev
    );
  };

  const onRun = async (id: string) => {
    try {
      const item = tableVals?.find((item) => item.Id === id);
      if (!item) {
        console.error("No backtest found with id:", id);
        return;
      }

      await PostBacktest(id, item.Params);
    } catch (err) {
      console.error("Error running backtesting:", err);
    }
  };

  return (
    <>
      <AppBar position="sticky" color="primary" elevation={1}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Backtesting
          </Typography>
        </Toolbar>
      </AppBar>

      <AddStrategy
        open={openAddStrategy}
        onClose={() => setOpenAddStrategy(false)}
      />

      <Container maxWidth="xl" className={classes.container}>
        <Paper elevation={2} className={classes.paper}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className={classes.sectionHeader}
          >
            <Box>
              <Typography variant="h6">Strategies</Typography>
              <Typography variant="body2" color="text.secondary">
                Configure parameters and run backtests
              </Typography>
            </Box>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => setOpenAddStrategy(true)}
            >
              New Strategy
            </Button>
          </Stack>
          <Divider className={classes.divider} />

          <TableContainer className={classes.tableContainer}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.headCell}>Name</TableCell>
                  <TableCell className={classes.headCell}>Ticker</TableCell>
                  <TableCell className={classes.headCell}>Start Date</TableCell>
                  <TableCell className={classes.headCell}>End Date</TableCell>
                  <TableCell className={classes.headCell}>Increment</TableCell>
                  <TableCell className={classes.headCell}>
                    Starting Cash
                  </TableCell>
                  <TableCell align="right" className={classes.actionsHeader}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableVals && tableVals.length > 0 ? (
                  tableVals.map((val) => (
                    <TableRow hover key={val.Id}>
                      <TableCell className={classes.nameCell}>
                        <TextField
                          size="small"
                          fullWidth
                          value={val.Name}
                          onChange={(e) =>
                            handleTableCellChange(
                              val.Id,
                              e.target.value,
                              "Name"
                            )
                          }
                          variant="outlined"
                          placeholder="Strategy name"
                        />
                      </TableCell>
                      <TableCell className={classes.tickerCell}>
                        <TextField
                          size="small"
                          fullWidth
                          defaultValue="AAPL"
                          value={val.Params.ticker}
                          onChange={(e) =>
                            handleParamChange(val.Id, "ticker", e.target.value)
                          }
                          variant="outlined"
                          placeholder="AAPL"
                        />
                      </TableCell>
                      <TableCell className={classes.dateCell}>
                        <TextField
                          size="small"
                          fullWidth
                          value={val.Params.start}
                          onChange={(e) =>
                            handleParamChange(val.Id, "start", e.target.value)
                          }
                          variant="outlined"
                          placeholder="YYYY-M-D"
                        />
                      </TableCell>
                      <TableCell className={classes.dateCell}>
                        <TextField
                          size="small"
                          fullWidth
                          value={val.Params.end}
                          onChange={(e) =>
                            handleParamChange(val.Id, "end", e.target.value)
                          }
                          variant="outlined"
                          placeholder="YYYY-M-D"
                        />
                      </TableCell>
                      <TableCell className={classes.incrementCell}>
                        <TextField
                          size="small"
                          fullWidth
                          value={val.Params.increment}
                          onChange={(e) =>
                            handleParamChange(
                              val.Id,
                              "increment",
                              e.target.value
                            )
                          }
                          variant="outlined"
                          placeholder="daily"
                        />
                      </TableCell>
                      <TableCell className={classes.cashCell}>
                        <TextField
                          size="small"
                          fullWidth
                          type="number"
                          value={val.Params.startingCash}
                          onChange={(e) =>
                            handleParamChange(
                              val.Id,
                              "startingCash",
                              Number(e.target.value)
                            )
                          }
                          variant="outlined"
                          inputProps={{ min: 0, step: 100 }}
                        />
                      </TableCell>
                      <TableCell align="right" className={classes.actionsCell}>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<PlayArrowIcon />}
                            onClick={() => onRun(val.Id)}
                          >
                            Run
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<VisibilityIcon />}
                            onClick={() => setViewId(val.Id)}
                          >
                            Results
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Box className={classes.emptyState}>
                        <Typography variant="subtitle1" gutterBottom>
                          No strategies yet
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Click "New Strategy" to create your first backtest.
                        </Typography>
                        <Button
                          startIcon={<AddIcon />}
                          variant="contained"
                          onClick={() => setOpenAddStrategy(true)}
                        >
                          New Strategy
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      {viewId !== "" && (
        <ViewResults id={viewId} open={true} onClose={() => setViewId("")} />
      )}
    </>
  );
}

export default App;
