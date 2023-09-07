import { Box, List, ListItem, ListItemButton, ListItemText, ListSubheader, Paper } from "@mui/material"
import PortraitIcon from "@mui/icons-material/Portrait"
import { useNavigate } from "react-router-dom"

function TraineesList(props) {
  const { trainees } = props
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        maxHeight:'auto',
        maxWidth: '100%',
        bgcolor: "background.paper",
        pY: 0,
        mY: 0,
        mb: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: 'center',
        flexWrap: "wrap",
      }}
    >
      <Paper
        sx={{ textAlign: "center", paddingBottom: 1, marginX: 0 }}
        elevation={5}
      >
        <List
          sx={{
            position: "relative",
            overflow: "auto",
            height: 'auto',
            maxHeight: 200,
            "& ul": { padding: 0, margin: 1 },
            mt: 1,
          }}
          subheader={<li />}
        >
          <ul style={{ textAlign: "center" }}>
            <ListSubheader sx={{ width: "auto" }}>
              My Trainees
            </ListSubheader>
            {trainees.map((traineeInfo) => {
              return (
                <div key={traineeInfo._id}>
                  <ListItem component="div" disablePadding>
                    <ListItemButton
                      onClick={() => navigate(`/trainee/${traineeInfo._id}`)}
                      sx={{ display: "flex", width: "100%" }}
                    >
                      <PortraitIcon />
                      <ListItemText
                        primary={`${traineeInfo.name.firstName} ${traineeInfo.name.lastName}`}
                        sx={{ marginLeft: 2 }}
                      />
                    </ListItemButton>
                  </ListItem>
                </div>
              )
            })}
          </ul>
        </List>
      </Paper>
    </Box>
  )

}

export default TraineesList
