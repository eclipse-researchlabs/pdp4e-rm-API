// /********************************************************************************
//  * Copyright (c) 2021,2021 Beawre Digital SL
//  *
//  * This program and the accompanying materials are made available under the
//  * terms of the Eclipse Public License 2.0 which is available at
//  * http://www.eclipse.org/legal/epl-2.0.
//  *
//  * SPDX-License-Identifier: EPL-2.0 3
//  *
//  ********************************************************************************/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.AuditTrail.Implementation.Commands;
using Core.AuditTrail.Interfaces.Services;
using Core.AuditTrail.Models;
using Core.Database.Tables;
using Core.Users.Implementation.Commands;
using Core.Users.Interfaces.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Core.Api.Controllers
{
    [Route("api/users"), ApiController, EnableCors("CorsRules")]
    public class UsersController : ControllerBase
    {
        private IAuditTrailService _auditTrailService;
        private IUserService _userService;

        public UsersController(IUserService userService, IAuditTrailService auditTrailService)
        {
            _userService = userService;
            _auditTrailService = auditTrailService;
        }

        [HttpPost, ProducesResponseType(201)]
        public async Task<IActionResult> Create([FromBody] CreateUserCommand command)
        {
            var newValue = await _userService.Create(command);
            _auditTrailService.LogAction(AuditTrailAction.CreateUser, newValue, new AuditTrailPayloadModel() {Data = JsonConvert.SerializeObject(command)});
            return Created(newValue.ToString(), newValue);
        }
    }
}