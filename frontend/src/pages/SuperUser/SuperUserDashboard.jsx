import { useState , useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';



const SuperUserDashboard = () => {
 const { Vgroups, setVGroups, members} = useAuth();
    const totalVGroups = Vgroups.length;
    const totalMembers = members.length;
    const activeVGroups = Vgroups.filter(group => group.vgStatus === 'active').length;
    const inactiveVGroups = Vgroups.filter(group => group.vgStatus === 'inactive').length;

 return (
    <>
        <div  className="container-fluid text-light">
            <h2 className="section-title-dark mb-4"><i className="bi bi-speedometer2 me-2"></i>VRecords Management</h2>
            
            <div className="row g-3 vrecords-stats-section">
                {/* Total Registered Groups */}
                <div className="col-md-4 col-lg-2">
                    <div className="card dashboard-card-dark p-3 text-center">
                        <i className="bi bi-house-check-fill fs-4 text-info mb-2"></i>
                        <div className="small text-secondary">Total Registered Groups</div>
                        <div className="fw-bold fs-5">{totalVGroups}</div>
                    </div>
                </div>

                {/* Total Registered Members */}
                <div className="col-md-4 col-lg-2">
                    <div className="card dashboard-card-dark p-3 text-center">
                        <i className="bi bi-people-fill fs-4 text-primary mb-2"></i>
                        <div className="small text-secondary">Total Registered Members</div>
                        <div className="fw-bold fs-5">{totalMembers}</div>
                    </div>
                </div>
                
                {/* Active Groups */}
                <div className="col-md-4 col-lg-2">
                    <div className="card dashboard-card-dark p-3 text-center">
                        <i className="bi bi-house-door-fill fs-4 text-success mb-2"></i>
                        <div className="small text-secondary">Active Groups</div>
                        <div className="fw-bold fs-5">{activeVGroups}</div>
                    </div>
                </div>

                {/* Inactive Groups */}
                <div className="col-md-4 col-lg-2">
                    <div className="card dashboard-card-dark p-3 text-center">
                        <i className="bi bi-house-slash-fill fs-4 text-danger mb-2"></i>
                        <div className="small text-secondary">Inactive Groups</div>
                        <div className="fw-bold fs-5">{inactiveVGroups}</div>
                    </div>
                </div>

            </div>

            {/* Table listing all VGroups with details group ID, name, number of members, status, etc. */}
            <div>
                <h3 className="section-title">Virtual Groups Overview</h3>
                <div className="card table-card-dark">
                    <div className="card-body">
                        <table className="table table-dark table-hover align-middle">
                            <thead>
                                <tr>
                                    <th scope="col">Group ID</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Total Members</th>
                                    <th scope="col">Created Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Vgroups.map(group => {
                                    const memberCount = members.filter(m => m.vgroupId === group.id).length;
                                    return (
                                        <tr key={group.id}>
                                            <td>{group.id}</td>
                                            <td>{group.name}</td>
                                            <td>
                                                <span className={`badge ${group.vgStatus === 'active' ? 'bg-success' : 'bg-danger'}`}>
                                                    {group.vgStatus.charAt(0).toUpperCase() + group.vgStatus.slice(1)}
                                                </span>
                                            </td>
                                            <td>{memberCount}</td>
                                            <td>{new Date(group.createdDate).toLocaleDateString()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </>
 );
}

export default SuperUserDashboard;